export interface CodeExample {
  id: string
  name: string
  category: string  // Primary category (for backward compatibility)
  categories?: string[]  // All categories this problem belongs to
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  code: string
  approach?: string
  timeComplexity?: string
  spaceComplexity?: string
  patternName?: string
  whyItWorks?: string
}

// Main 9 categories for the home page
export const exampleCategories = [
  { id: 'js-core', name: 'JavaScript Core', description: 'Closures, this, prototypes, hoisting, scope' },
  { id: 'async-js', name: 'Async JavaScript', description: 'Promises, async/await, event loop patterns' },
  { id: 'array-polyfills', name: 'Array Polyfills', description: 'Implement map, filter, reduce, flat' },
  { id: 'utility-functions', name: 'Utility Functions', description: 'Debounce, throttle, deep clone, memoize' },
  { id: 'functional-js', name: 'Functional JS', description: 'Curry, compose, pipe, partial application' },
  { id: 'dom-events', name: 'DOM & Events', description: 'Event emitter, delegation, pub/sub' },
  { id: 'object-utils', name: 'Object Utilities', description: 'Deep equal, merge, get/set nested props' },
  { id: 'promise-polyfills', name: 'Promise Polyfills', description: 'Promise.all, race, allSettled, promisify' },
  { id: 'dsa', name: 'DSA', description: 'Data structures & algorithms' },
]

// DSA subcategories for filtering within DSA page
export const dsaSubcategories = [
  { id: 'arrays-hashing', name: 'Arrays & Hashing' },
  { id: 'two-pointers', name: 'Two Pointers' },
  { id: 'sliding-window', name: 'Sliding Window' },
  { id: 'stack', name: 'Stack' },
  { id: 'binary-search', name: 'Binary Search' },
  { id: 'linked-list', name: 'Linked List' },
  { id: 'strings', name: 'Strings' },
  { id: 'sorting', name: 'Sorting' },
  { id: 'recursion', name: 'Recursion' },
  { id: 'dynamic-programming', name: 'Dynamic Programming' },
  { id: 'greedy', name: 'Greedy' },
  { id: 'backtracking', name: 'Backtracking' },
  { id: 'graphs', name: 'Graphs' },
  { id: 'trees', name: 'Trees' },
  { id: 'trie', name: 'Trie' },
  { id: 'heap', name: 'Heap' },
  { id: 'intervals', name: 'Intervals' },
  { id: 'bit-manipulation', name: 'Bit Manipulation' },
  { id: 'math', name: 'Math & Geometry' },
]

// Helper to get all categories for a problem
const getAllCategories = (example: CodeExample): string[] => {
  return example.categories || [example.category]
}

// Helper to check if a category is a DSA subcategory
export const isDsaSubcategory = (cat: string) => dsaSubcategories.some(s => s.id === cat)

// Check if example belongs to a DSA subcategory
const isDsaExample = (example: CodeExample): boolean => {
  return getAllCategories(example).some(cat => isDsaSubcategory(cat))
}

// Get examples by category (problem appears in all its categories)
export const getExamplesByCategory = (categoryId: string) => {
  if (categoryId === 'dsa') {
    return codeExamples.filter(e => isDsaExample(e))
  }
  return codeExamples.filter(e => getAllCategories(e).includes(categoryId))
}

// Get unique problem count for DSA (no double counting)
export const getUniqueDsaProblemCount = (): number => {
  return codeExamples.filter(e => isDsaExample(e)).length
}

// Get problem count by subcategory
export const getProblemCountByCategory = (categoryId: string): number => {
  return getExamplesByCategory(categoryId).length
}

// Get all JavaScript examples (non-DSA problems), deduplicated by ID
export const getAllJsExamples = (): CodeExample[] => {
  const jsExamples = codeExamples.filter(e => !isDsaExample(e))
  const seen = new Set<string>()
  return jsExamples.filter(e => {
    if (seen.has(e.id)) return false
    seen.add(e.id)
    return true
  })
}

export const codeExamples: CodeExample[] = [
  // ==================== JAVASCRIPT CORE ====================
  {
    id: 'closure-counter',
    name: 'Closure Counter',
    category: 'js-core',
    difficulty: 'easy',
    description: 'Understand closures with a counter factory',
    code: `// Closure Counter - Understanding Closures

function createCounter(initialValue) {
  let count = initialValue;
  console.log("Counter created with:", count);

  return {
    increment: function() {
      count++;
      console.log("After increment:", count);
      return count;
    },
    decrement: function() {
      count--;
      console.log("After decrement:", count);
      return count;
    },
    getValue: function() {
      return count;
    }
  };
}

let counter1 = createCounter(0);
let counter2 = createCounter(100);

console.log("\\n--- Counter 1 ---");
counter1.increment();
counter1.increment();
counter1.increment();

console.log("\\n--- Counter 2 ---");
counter2.decrement();
counter2.decrement();

console.log("\\n--- Final Values ---");
console.log("Counter 1:", counter1.getValue());
console.log("Counter 2:", counter2.getValue());
`,
    approach: 'Create a factory function that returns an object with increment, decrement, and getValue methods. Each returned method closes over a shared count variable, demonstrating how closures preserve access to their enclosing scope even after the outer function returns.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Closure Pattern',
    whyItWorks: 'Inner functions retain a reference to outer variables even after the outer function returns. Each call to createCounter creates a new scope with its own independent count variable.',
  },
  {
    id: 'this-binding',
    name: 'This Binding',
    category: 'js-core',
    difficulty: 'medium',
    description: 'Understand how "this" works in different contexts',
    code: `// This Binding - Understanding "this" keyword

let user = {
  name: "Alice",
  greet: function() {
    console.log("Hello, I am " + this.name);
  }
};

console.log("=== Method call ===");
user.greet();

console.log("\\n=== Using bind() ===");
let boundGreet = user.greet.bind(user);
boundGreet();

console.log("\\n=== Using call() ===");
let bob = { name: "Bob" };
user.greet.call(bob);

console.log("\\n=== Using apply() ===");
user.greet.apply({ name: "Charlie" });

console.log("\\n=== Arrow in method ===");
let obj = {
  name: "Object",
  arrowMethod: function() {
    let arrow = () => console.log("Arrow this:", this.name);
    arrow();
  }
};
obj.arrowMethod();
`,
    approach: 'Demonstrate the four rules of this binding: method call (implicit), bind (explicit hard binding), call/apply (explicit), and arrow functions (lexical). Each pattern shows how JavaScript resolves the this reference at the call site.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'This Binding Rules',
    whyItWorks: 'The value of this is determined by how a function is called, not where it is defined. Arrow functions are the exception: they capture this lexically from their enclosing scope at creation time.',
  },
  {
    id: 'prototype-chain',
    name: 'Prototype Chain',
    category: 'js-core',
    difficulty: 'medium',
    description: 'Understand prototypal inheritance',
    code: `// Prototype Chain - Prototypal Inheritance

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(this.name + " makes a sound");
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(this.name + " barks!");
};

console.log("=== Creating instances ===");
let animal = new Animal("Generic");
let dog = new Dog("Buddy", "Golden Retriever");

console.log("\\n=== Methods ===");
animal.speak();
dog.speak();
dog.bark();

console.log("\\n=== instanceof ===");
console.log("dog instanceof Dog:", dog instanceof Dog);
console.log("dog instanceof Animal:", dog instanceof Animal);
`,
    approach: 'Set up prototypal inheritance by creating a Dog constructor that calls Animal via Animal.call(this, name), then links prototypes with Object.create(Animal.prototype). This establishes the prototype chain so Dog instances inherit Animal methods while adding their own.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Prototype Chain',
    whyItWorks: 'JavaScript property lookup walks the prototype chain. When dog.speak() is called, the engine checks dog, then Dog.prototype, then Animal.prototype, finding the method there.',
  },
  {
    id: 'hoisting-demo',
    name: 'Hoisting Demo',
    category: 'js-core',
    difficulty: 'easy',
    description: 'Understand variable and function hoisting',
    code: `// Hoisting Demo

console.log("=== Function Hoisting ===");
sayHello();

function sayHello() {
  console.log("Hello! Functions are hoisted.");
}

console.log("\\n=== var Hoisting ===");
console.log("x before:", x);
var x = 5;
console.log("x after:", x);

console.log("\\n=== let/const TDZ ===");
// console.log(y); // ReferenceError
let y = 10;
console.log("y after:", y);

console.log("\\n=== Loop scoping ===");
for (var i = 0; i < 3; i++) {}
console.log("var i after loop:", i);

for (let j = 0; j < 3; j++) {}
console.log("let j: not accessible");
`,
    approach: 'Contrast function hoisting (fully hoisted and callable before declaration), var hoisting (declaration hoisted but value is undefined), and let/const temporal dead zone (not accessible before declaration). Loop scoping highlights var leaking into outer scope versus let being block-scoped.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Hoisting and TDZ',
    whyItWorks: 'JavaScript hoists declarations during the compile phase. Function declarations are fully initialized, var is initialized to undefined, and let/const remain uninitialized until execution reaches the declaration.',
  },
  {
    id: 'scope-chain',
    name: 'Scope Chain',
    category: 'js-core',
    difficulty: 'medium',
    description: 'Understand lexical scope',
    code: `// Scope Chain - Lexical Scoping

let global = "global";

function outer() {
  let outerVar = "outer";

  function inner() {
    let innerVar = "inner";

    console.log("inner:", innerVar);
    console.log("outer:", outerVar);
    console.log("global:", global);
  }

  inner();
}

outer();

console.log("\\n=== Shadowing ===");
let shadow = "global";

function test() {
  let shadow = "local";
  console.log("Inside:", shadow);
}

test();
console.log("Outside:", shadow);
`,
    approach: 'Nest functions to demonstrate lexical scope chain lookup. The inner function accesses its own variables, then the enclosing outer function variables, then global variables. Variable shadowing shows that a local declaration hides the outer variable of the same name without modifying it.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Lexical Scope Chain',
    whyItWorks: 'JavaScript resolves variable references by walking outward through the lexical scope chain, stopping at the first match. Shadowing creates a new binding in the inner scope, leaving the outer binding untouched.',
  },
  {
    id: 'implement-call',
    name: 'Implement call()',
    category: 'js-core',
    difficulty: 'medium',
    description: 'Implement Function.prototype.call',
    code: `// Implement Function.prototype.call
// call() invokes a function with a given 'this' and arguments

Function.prototype.myCall = function(context, ...args) {
  // Handle null/undefined context
  context = context || globalThis;

  // Create a unique property to avoid overwriting
  let fnKey = Symbol('fn');

  // Attach the function to context
  context[fnKey] = this;

  console.log("Context:", context);
  console.log("Args:", args);

  // Call with context
  let result = context[fnKey](...args);

  // Clean up
  delete context[fnKey];

  return result;
};

function greet(greeting, punctuation) {
  return greeting + ", " + this.name + punctuation;
}

let person = { name: "Alice" };

console.log("=== Testing myCall ===");
let result = greet.myCall(person, "Hello", "!");
console.log("Result:", result);

console.log("\\n=== Compare with native call ===");
let native = greet.call(person, "Hi", "?");
console.log("Native:", native);
`,
    approach: 'Attach the target function as a temporary method on the context object using a Symbol key to avoid property collisions. Invoke it via context[fnKey](...args) so that this resolves to context, then clean up by deleting the temporary property.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Context Binding Polyfill',
    whyItWorks: 'When a function is called as a method of an object (obj.fn()), JavaScript sets this to the object. By temporarily attaching the function to the desired context, we leverage implicit this binding.',
  },
  {
    id: 'implement-apply',
    name: 'Implement apply()',
    category: 'js-core',
    difficulty: 'medium',
    description: 'Implement Function.prototype.apply',
    code: `// Implement Function.prototype.apply
// apply() is like call() but takes args as array

Function.prototype.myApply = function(context, args) {
  context = context || globalThis;
  args = args || [];

  let fnKey = Symbol('fn');
  context[fnKey] = this;

  console.log("Context:", context);
  console.log("Args array:", args);

  let result = context[fnKey](...args);
  delete context[fnKey];

  return result;
};

function introduce(age, city) {
  return this.name + " is " + age + " from " + city;
}

let user = { name: "Bob" };

console.log("=== Testing myApply ===");
let result = introduce.myApply(user, [25, "NYC"]);
console.log("Result:", result);

console.log("\\n=== Math.max with apply ===");
let nums = [3, 1, 4, 1, 5, 9];
let max = Math.max.apply(null, nums);
console.log("Max of", nums, "is", max);
`,
    approach: 'Use the same Symbol-based temporary method technique as call(), but accept arguments as an array instead of individually. Default the args parameter to an empty array to handle calls with no arguments. Spread the array when invoking the temporary method.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Context Binding Polyfill',
    whyItWorks: 'Apply is identical to call except it takes arguments as a single array, which is then spread. This was historically important before the spread operator existed for passing dynamic argument lists.',
  },
  {
    id: 'implement-bind',
    name: 'Implement bind()',
    category: 'js-core',
    difficulty: 'hard',
    description: 'Implement Function.prototype.bind',
    code: `// Implement Function.prototype.bind
// bind() returns a new function with bound 'this'

Function.prototype.myBind = function(context, ...boundArgs) {
  let originalFn = this;

  return function(...callArgs) {
    // Combine bound args with call args
    let allArgs = [...boundArgs, ...callArgs];
    console.log("Bound args:", boundArgs);
    console.log("Call args:", callArgs);

    return originalFn.apply(context, allArgs);
  };
};

function multiply(a, b, c) {
  return this.factor * a * b * c;
}

let obj = { factor: 2 };

console.log("=== Partial Application ===");
let double = multiply.myBind(obj, 1);
console.log("double(3, 4):", double(3, 4));

console.log("\\n=== Full Binding ===");
let boundFn = multiply.myBind(obj, 2, 3, 4);
console.log("boundFn():", boundFn());

console.log("\\n=== Event Handler Pattern ===");
let button = {
  text: "Click me",
  handleClick: function() {
    console.log("Button:", this.text);
  }
};
let handler = button.handleClick.myBind(button);
handler();
`,
    approach: 'Return a new function that closes over the original function reference, the bound context, and any partially applied arguments. When the returned function is called, concatenate the bound args with the new call args and delegate to originalFn.apply(context, allArgs). This enables both full binding and partial application.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    patternName: 'Partial Application',
    whyItWorks: 'The returned closure captures the original function and context permanently. Combining bound args with call-time args enables currying-like partial application where some arguments are pre-filled.',
  },
  {
    id: 'implement-new',
    name: 'Implement new Operator',
    category: 'js-core',
    difficulty: 'hard',
    description: 'Implement your own new operator',
    code: `// Implement new Operator
// new: 1) Create object, 2) Set prototype, 3) Call constructor, 4) Return

function myNew(Constructor, ...args) {
  console.log("Creating instance of:", Constructor.name);

  // 1. Create new object with constructor's prototype
  let obj = Object.create(Constructor.prototype);
  console.log("Created object with prototype");

  // 2. Call constructor with obj as 'this'
  let result = Constructor.apply(obj, args);
  console.log("Constructor returned:", result);

  // 3. Return object (or constructor's return if it's an object)
  if (result && typeof result === 'object') {
    return result;
  }
  return obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return "Hi, I'm " + this.name;
};

console.log("=== Using myNew ===");
let p1 = myNew(Person, "Alice", 30);
console.log("Instance:", p1);
console.log("Greet:", p1.greet());

console.log("\\n=== instanceof check ===");
console.log("p1 instanceof Person:", p1 instanceof Person);
`,
    approach: 'Replicate the four steps of the new operator: create a blank object with Object.create(Constructor.prototype), invoke the constructor with the new object as this via Constructor.apply(obj, args), and return the constructor result if it is an object, otherwise return the created object.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Constructor Pattern',
    whyItWorks: 'The new operator links the created object to the constructor prototype chain before calling the constructor. If the constructor returns a non-object, the newly created object is used instead.',
  },
  {
    id: 'implement-object-create',
    name: 'Implement Object.create',
    category: 'js-core',
    difficulty: 'medium',
    description: 'Implement Object.create',
    code: `// Implement Object.create
// Creates new object with specified prototype

function myObjectCreate(proto, propertiesObject) {
  if (proto === null) {
    return Object.setPrototypeOf({}, null);
  }

  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Prototype must be an object or null');
  }

  // Create constructor with desired prototype
  function F() {}
  F.prototype = proto;

  let obj = new F();

  // Add properties if provided
  if (propertiesObject) {
    Object.defineProperties(obj, propertiesObject);
  }

  return obj;
}

let animal = {
  speak: function() {
    console.log(this.name + " makes a sound");
  }
};

console.log("=== Creating with prototype ===");
let dog = myObjectCreate(animal);
dog.name = "Buddy";
dog.speak();

console.log("\\n=== With property descriptors ===");
let cat = myObjectCreate(animal, {
  name: { value: "Whiskers", writable: true },
  meow: { value: function() { console.log("Meow!"); } }
});
cat.speak();
cat.meow();

console.log("\\n=== Prototype chain ===");
console.log("dog's proto:", Object.getPrototypeOf(dog) === animal);
`,
    approach: 'Create an empty constructor function F, set F.prototype to the desired proto object, then instantiate with new F(). This produces an object whose internal [[Prototype]] points to proto. Optionally apply property descriptors via Object.defineProperties for the second argument.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Prototype Delegation',
    whyItWorks: 'Setting F.prototype before calling new F() ensures the new object has the correct prototype link. This is the classic polyfill pattern used before Object.create was standardized in ES5.',
  },
  {
    id: 'implement-instanceof',
    name: 'Implement instanceof',
    category: 'js-core',
    difficulty: 'medium',
    description: 'Implement the instanceof operator',
    code: `// Implement instanceof
// Checks if object's prototype chain contains Constructor.prototype

function myInstanceof(obj, Constructor) {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  let proto = Object.getPrototypeOf(obj);
  let target = Constructor.prototype;

  console.log("Checking prototype chain...");

  while (proto !== null) {
    console.log("Current proto:", proto.constructor?.name || 'Object');

    if (proto === target) {
      console.log("Match found!");
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  console.log("No match in chain");
  return false;
}

function Animal(name) { this.name = name; }
function Dog(name) { Animal.call(this, name); }
Dog.prototype = Object.create(Animal.prototype);

let dog = new Dog("Buddy");

console.log("=== Dog instanceof Dog ===");
console.log(myInstanceof(dog, Dog));

console.log("\\n=== Dog instanceof Animal ===");
console.log(myInstanceof(dog, Animal));

console.log("\\n=== Dog instanceof Array ===");
console.log(myInstanceof(dog, Array));
`,
    approach: 'Walk the prototype chain of the target object using Object.getPrototypeOf in a while loop. At each step, compare the current prototype to Constructor.prototype. Return true on a match or false when the chain ends at null.',
    timeComplexity: 'O(d)',
    spaceComplexity: 'O(1)',
    patternName: 'Prototype Chain Traversal',
    whyItWorks: 'The instanceof operator checks if Constructor.prototype exists anywhere in the object prototype chain. Walking the chain with getPrototypeOf replicates this lookup exactly.',
  },
  {
    id: 'typeof-vs-instanceof',
    name: 'typeof vs instanceof',
    category: 'js-core',
    difficulty: 'easy',
    description: 'Understand the difference between typeof and instanceof',
    code: `// typeof vs instanceof
// typeof: returns primitive type string
// instanceof: checks prototype chain

console.log("=== typeof examples ===");
console.log("typeof 42:", typeof 42);
console.log("typeof 'hello':", typeof "hello");
console.log("typeof true:", typeof true);
console.log("typeof undefined:", typeof undefined);
console.log("typeof null:", typeof null); // Bug!
console.log("typeof {}:", typeof {});
console.log("typeof []:", typeof []);
console.log("typeof function(){}:", typeof function(){});

console.log("\\n=== instanceof examples ===");
let arr = [1, 2, 3];
let obj = { a: 1 };
let date = new Date();

console.log("[] instanceof Array:", arr instanceof Array);
console.log("[] instanceof Object:", arr instanceof Object);
console.log("{} instanceof Object:", obj instanceof Object);
console.log("date instanceof Date:", date instanceof Date);

console.log("\\n=== Gotchas ===");
console.log("typeof null === 'object':", typeof null === 'object');
console.log("typeof [] === 'object':", typeof [] === 'object');
console.log("Array.isArray([]):", Array.isArray(arr));
`,
    approach: 'Compare typeof (returns a string for primitive types and "object"/"function" for references) with instanceof (walks the prototype chain). Highlight the classic gotchas: typeof null returns "object", typeof [] returns "object", and show Array.isArray as the reliable array check.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Type Checking Patterns',
    whyItWorks: 'typeof operates on the internal type tag of a value (with the null bug being a legacy spec issue), while instanceof relies on the prototype chain. Neither alone covers all cases, so combining them or using Array.isArray is necessary.',
  },
  {
    id: 'execution-context',
    name: 'Execution Context',
    category: 'js-core',
    difficulty: 'medium',
    description: 'Understand JavaScript execution context',
    code: `// Execution Context
// Each function call creates a new execution context

let globalVar = "I'm global";

function outer() {
  let outerVar = "I'm in outer";
  console.log("Outer context created");
  console.log("Can access globalVar:", globalVar);

  function inner() {
    let innerVar = "I'm in inner";
    console.log("\\nInner context created");
    console.log("Can access innerVar:", innerVar);
    console.log("Can access outerVar:", outerVar);
    console.log("Can access globalVar:", globalVar);
  }

  inner();
  console.log("\\nBack to outer context");
}

console.log("=== Global Execution Context ===");
console.log("globalVar:", globalVar);

console.log("\\n=== Function Execution Context ===");
outer();

console.log("\\n=== Context Stack Demo ===");
function first() {
  console.log("first() pushed to stack");
  second();
  console.log("first() about to pop");
}

function second() {
  console.log("second() pushed to stack");
  third();
  console.log("second() about to pop");
}

function third() {
  console.log("third() pushed to stack");
  console.log("third() about to pop");
}

first();
`,
    approach: 'Demonstrate the execution context stack by nesting function calls three levels deep. Each call creates a new execution context pushed onto the call stack, and each return pops it. Inner functions access outer variables through the scope chain attached to their execution context.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    patternName: 'Execution Context Stack',
    whyItWorks: 'Every function invocation creates an execution context with its own variable environment and scope chain. The call stack tracks which context is active, enabling JavaScript to resume the caller after the callee returns.',
  },

  // ==================== ASYNC JAVASCRIPT ====================
  {
    id: 'promise-chain',
    name: 'Promise Chaining',
    category: 'async-js',
    difficulty: 'easy',
    description: 'Sequential async with promises',
    code: `// Promise Chaining

function delay(ms, val) {
  return new Promise(r => setTimeout(() => r(val), ms));
}

function fetchUser(id) {
  console.log("Fetching user...");
  return delay(100, { id, name: "User " + id });
}

function fetchPosts(user) {
  console.log("Fetching posts for", user.name);
  return delay(100, ["Post 1", "Post 2"]);
}

fetchUser(1)
  .then(user => {
    console.log("Got user:", user);
    return fetchPosts(user);
  })
  .then(posts => {
    console.log("Got posts:", posts);
  })
  .catch(err => console.log("Error:", err));
`,
    approach: 'Chain .then() calls to sequence dependent async operations: first fetch the user, then use the resolved user object to fetch their posts. Each .then() returns a new promise, enabling flat chaining instead of nesting. A single .catch() at the end handles errors from any step.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Promise Chaining',
    whyItWorks: 'Each .then() callback receives the resolved value of the previous promise and returns a new promise. This creates a sequential pipeline where the output of one async step feeds into the next.',
  },
  {
    id: 'async-await-basics',
    name: 'Async/Await Basics',
    category: 'async-js',
    difficulty: 'easy',
    description: 'Modern async syntax',
    code: `// Async/Await

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchData(id) {
  console.log("Fetching", id);
  await delay(100);
  return { id, data: "Data " + id };
}

async function main() {
  console.log("Starting...\\n");

  try {
    let d1 = await fetchData(1);
    console.log("Got:", d1);

    let d2 = await fetchData(2);
    console.log("Got:", d2);

    console.log("\\nDone!");
  } catch (e) {
    console.log("Error:", e);
  }
}

main();
`,
    approach: 'Use async/await to write asynchronous code that reads like synchronous code. Await each fetchData call to pause execution until the promise resolves, then store the result. Wrap everything in try/catch for centralized error handling of any rejected promise.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Async/Await',
    whyItWorks: 'The await keyword suspends the async function until the promise settles, then resumes with the resolved value. Under the hood, the engine transforms this into promise chains, but the code reads sequentially.',
  },
  {
    id: 'sequential-vs-parallel',
    name: 'Sequential vs Parallel',
    category: 'async-js',
    difficulty: 'medium',
    description: 'Compare async execution patterns',
    code: `// Sequential vs Parallel

function fetch(id) {
  return new Promise(r => {
    setTimeout(() => {
      console.log("  Got " + id);
      r(id);
    }, 50 + id * 20);
  });
}

async function sequential() {
  console.log("=== Sequential ===");
  for (let id of [1, 2, 3]) {
    await fetch(id);
  }
  console.log("Done sequential");
}

async function parallel() {
  console.log("\\n=== Parallel ===");
  await Promise.all([1, 2, 3].map(fetch));
  console.log("Done parallel");
}

async function main() {
  await sequential();
  await parallel();
  console.log("\\nParallel is faster!");
}

main();
`,
    approach: 'Compare two async patterns: sequential execution using a for loop with await (each request waits for the previous one), and parallel execution using Promise.all with map (all requests fire simultaneously). This demonstrates the performance difference between serial and concurrent I/O.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Sequential vs Parallel Async',
    whyItWorks: 'Promise.all fires all promises concurrently and waits for all to settle, taking only as long as the slowest request. Sequential await adds up all individual wait times, making it slower for independent operations.',
  },

  // ==================== ARRAY POLYFILLS ====================
  {
    id: 'implement-map',
    name: 'Implement Array.map',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own map',
    code: `// Implement Array.map

Array.prototype.myMap = function(cb) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    let mapped = cb(this[i], i, this);
    result.push(mapped);
    console.log(this[i], "->", mapped);
  }
  return result;
};

console.log("=== Double ===");
let nums = [1, 2, 3, 4, 5];
let doubled = nums.myMap(x => x * 2);
console.log("Result:", doubled);

console.log("\\n=== Extract ===");
let users = [{ name: 'Alice' }, { name: 'Bob' }];
console.log(users.myMap(u => u.name));
`,
    approach: 'Iterate through the array, apply the callback to each element with (value, index, array) arguments, and push each transformed result into a new array. The original array is never modified, preserving immutability.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Map creates a 1:1 transformation: every input element produces exactly one output element. The callback receives the current value, index, and original array, matching the native Array.prototype.map signature.',
  },
  {
    id: 'implement-filter',
    name: 'Implement Array.filter',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own filter',
    code: `// Implement Array.filter

Array.prototype.myFilter = function(cb) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    let keep = cb(this[i], i, this);
    console.log(this[i], "->", keep ? "keep" : "skip");
    if (keep) result.push(this[i]);
  }
  return result;
};

console.log("=== Evens ===");
let nums = [1, 2, 3, 4, 5, 6];
console.log(nums.myFilter(x => x % 2 === 0));

console.log("\\n=== Truthy ===");
let mixed = [0, 1, '', 'hi', null, true];
console.log(mixed.myFilter(Boolean));
`,
    approach: 'Iterate through the array and invoke the callback predicate for each element. If the predicate returns a truthy value, push the original element into a result array. Elements that fail the test are skipped, producing a subset of the original array.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Filter tests each element against a predicate and includes only those that pass. Passing Boolean as the callback is a common idiom to remove all falsy values (0, "", null, undefined, false).',
  },
  {
    id: 'implement-reduce',
    name: 'Implement Array.reduce',
    category: 'array-polyfills',
    difficulty: 'medium',
    description: 'Build your own reduce',
    code: `// Implement Array.reduce

Array.prototype.myReduce = function(cb, init) {
  let acc = init !== undefined ? init : this[0];
  let start = init !== undefined ? 0 : 1;

  console.log("Initial:", acc);

  for (let i = start; i < this.length; i++) {
    let prev = acc;
    acc = cb(acc, this[i], i, this);
    console.log(prev, "+", this[i], "=", acc);
  }
  return acc;
};

console.log("=== Sum ===");
console.log([1,2,3,4,5].myReduce((a,b) => a+b, 0));

console.log("\\n=== Max ===");
console.log([3,7,2,9].myReduce((a,b) => b>a ? b : a));

console.log("\\n=== Flatten ===");
console.log([[1,2],[3,4]].myReduce((a,b) => a.concat(b), []));
`,
    approach: 'Initialize the accumulator to the provided init value (or the first element if omitted, starting iteration from index 1). On each iteration, pass the accumulator and current element to the callback, updating the accumulator with the return value. Return the final accumulator after the loop.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Reduce collapses an array into a single value by threading an accumulator through each iteration. The flexibility of the callback allows it to implement sum, max, flatten, groupBy, and nearly any array transformation.',
  },
  {
    id: 'implement-flat',
    name: 'Implement Array.flat',
    category: 'array-polyfills',
    difficulty: 'medium',
    description: 'Build your own flat',
    code: `// Implement Array.flat

Array.prototype.myFlat = function(depth = 1) {
  function flatten(arr, d) {
    let result = [];
    for (let item of arr) {
      if (Array.isArray(item) && d > 0) {
        console.log("Flatten:", item);
        result = result.concat(flatten(item, d - 1));
      } else {
        result.push(item);
      }
    }
    return result;
  }
  return flatten(this, depth);
};

console.log("=== Depth 1 ===");
console.log([1, [2, [3]]].myFlat());

console.log("\\n=== Depth 2 ===");
console.log([1, [2, [3, [4]]]].myFlat(2));

console.log("\\n=== Infinity ===");
console.log([1, [2, [3, [4]]]].myFlat(Infinity));
`,
    approach: 'Use a recursive helper function that iterates over each item. If the item is an array and the remaining depth is greater than 0, recurse with depth - 1. Otherwise, push the item to the result. Concatenate sub-results to build the flattened output.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Recursive Flattening',
    whyItWorks: 'The depth parameter controls how many levels of nesting to unwrap. Each recursive call decrements depth by 1, so arrays nested deeper than the specified depth are left as-is. Using Infinity flattens all levels.',
  },
  {
    id: 'implement-foreach',
    name: 'Implement Array.forEach',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own forEach',
    code: `// Implement Array.forEach

Array.prototype.myForEach = function(callback) {
  for (let i = 0; i < this.length; i++) {
    console.log("Index:", i, "Value:", this[i]);
    callback(this[i], i, this);
  }
};

let sum = 0;
[1, 2, 3, 4, 5].myForEach(function(num) {
  sum = sum + num;
  console.log("  Running sum:", sum);
});

console.log("\\nFinal sum:", sum);
`,
    approach: 'Loop through the array and invoke the callback with (element, index, array) for each item. Unlike map, forEach returns undefined and is used purely for side effects. The implementation does not collect return values.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Array Polyfill',
    whyItWorks: 'forEach provides a cleaner syntax than a for loop for executing side effects on each element. It always iterates the entire array and cannot be short-circuited with break or return.',
  },
  {
    id: 'implement-find',
    name: 'Implement Array.find',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own find',
    code: `// Implement Array.find

Array.prototype.myFind = function(callback) {
  for (let i = 0; i < this.length; i++) {
    console.log("Checking:", this[i]);
    if (callback(this[i], i, this)) {
      console.log("  Found!");
      return this[i];
    }
  }
  console.log("Not found");
  return undefined;
};

let users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Carol", age: 35 }
];

console.log("Find age > 28:");
let found = users.myFind(function(u) {
  return u.age > 28;
});
console.log("Result:", found);

console.log("\\nFind age > 100:");
let notFound = users.myFind(function(u) {
  return u.age > 100;
});
console.log("Result:", notFound);
`,
    approach: 'Iterate through the array and test each element with the callback predicate. Return the first element for which the callback returns truthy, short-circuiting the loop. If no element matches, return undefined.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Find uses early return to stop iteration as soon as a match is found, making it more efficient than filter when only the first match is needed. Returning undefined for no match distinguishes it from returning a falsy found value.',
  },
  {
    id: 'implement-findindex',
    name: 'Implement Array.findIndex',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own findIndex',
    code: `// Implement Array.findIndex

Array.prototype.myFindIndex = function(callback) {
  for (let i = 0; i < this.length; i++) {
    console.log("Index", i + ":", this[i]);
    if (callback(this[i], i, this)) {
      console.log("  Match at index", i);
      return i;
    }
  }
  console.log("No match found");
  return -1;
};

let numbers = [10, 20, 30, 40, 50];

console.log("Find index where num > 25:");
let idx = numbers.myFindIndex(function(n) {
  return n > 25;
});
console.log("Result:", idx);

console.log("\\nFind index where num > 100:");
let noIdx = numbers.myFindIndex(function(n) {
  return n > 100;
});
console.log("Result:", noIdx);
`,
    approach: 'Loop through the array and test each element against the callback predicate. Return the index of the first element that passes the test, short-circuiting the iteration. Return -1 if no element satisfies the condition.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Array Polyfill',
    whyItWorks: 'FindIndex returns a numeric position rather than the element itself, which is useful when you need to know where a match occurs for subsequent splice, slice, or index-based operations.',
  },
  {
    id: 'implement-some',
    name: 'Implement Array.some',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own some',
    code: `// Implement Array.some

Array.prototype.mySome = function(callback) {
  for (let i = 0; i < this.length; i++) {
    console.log("Test:", this[i]);
    if (callback(this[i], i, this)) {
      console.log("  Pass! Return true");
      return true;
    }
    console.log("  Fail, continue...");
  }
  console.log("None passed");
  return false;
};

let ages = [16, 17, 18, 19];

console.log("Any adult (>= 18)?");
let hasAdult = ages.mySome(function(age) {
  return age >= 18;
});
console.log("Result:", hasAdult);

console.log("\\nAny senior (>= 65)?");
let hasSenior = ages.mySome(function(age) {
  return age >= 65;
});
console.log("Result:", hasSenior);
`,
    approach: 'Iterate through the array and test each element with the callback. Return true immediately when any element passes the test, short-circuiting the remaining iterations. Return false only if every element fails the predicate.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Some implements existential quantification: it answers "does at least one element satisfy this condition?" Early return on the first truthy result makes it efficient for large arrays where a match is found early.',
  },
  {
    id: 'implement-every',
    name: 'Implement Array.every',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own every',
    code: `// Implement Array.every

Array.prototype.myEvery = function(callback) {
  for (let i = 0; i < this.length; i++) {
    console.log("Test:", this[i]);
    if (!callback(this[i], i, this)) {
      console.log("  Fail! Return false");
      return false;
    }
    console.log("  Pass, continue...");
  }
  console.log("All passed!");
  return true;
};

console.log("All positive?");
let allPositive = [1, 2, 3, 4].myEvery(function(n) {
  return n > 0;
});
console.log("Result:", allPositive);

console.log("\\nAll even?");
let allEven = [2, 4, 5, 8].myEvery(function(n) {
  return n % 2 === 0;
});
console.log("Result:", allEven);
`,
    approach: 'Iterate through the array and test each element with the callback. Return false immediately when any element fails the test, short-circuiting the remaining iterations. Return true only after every element has passed the predicate.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Every implements universal quantification: it answers "do all elements satisfy this condition?" Early return on the first falsy result avoids unnecessary work, and it is the logical complement of some.',
  },
  {
    id: 'implement-includes',
    name: 'Implement Array.includes',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own includes',
    code: `// Implement Array.includes

Array.prototype.myIncludes = function(search, fromIndex) {
  let start = fromIndex || 0;
  if (start < 0) {
    start = this.length + start;
  }

  console.log("Search for:", search);
  console.log("Start index:", start);

  for (let i = start; i < this.length; i++) {
    console.log("  Check [" + i + "]:", this[i]);
    if (this[i] === search) {
      console.log("  Found!");
      return true;
    }
  }
  console.log("Not found");
  return false;
};

let arr = [1, 2, 3, 4, 5];

console.log("Includes 3?");
console.log("Result:", arr.myIncludes(3));

console.log("\\nIncludes 3, from index 3?");
console.log("Result:", arr.myIncludes(3, 3));

console.log("\\nIncludes 6?");
console.log("Result:", arr.myIncludes(6));
`,
    approach: 'Linear scan from the fromIndex position (defaulting to 0), using strict equality (===) to compare each element with the search value. Handle negative fromIndex by adding it to the array length. Return true on the first match or false after exhausting the array.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Includes provides a boolean membership test that is more readable than indexOf !== -1. The fromIndex parameter enables searching from a specific position, useful for finding duplicates after a known index.',
  },
  {
    id: 'implement-indexof',
    name: 'Implement Array.indexOf',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own indexOf',
    code: `// Implement Array.indexOf

Array.prototype.myIndexOf = function(search, fromIndex) {
  let start = fromIndex || 0;
  if (start < 0) {
    start = this.length + start;
  }

  console.log("Search for:", search);

  for (let i = start; i < this.length; i++) {
    console.log("  [" + i + "]:", this[i]);
    if (this[i] === search) {
      console.log("  Match!");
      return i;
    }
  }
  console.log("Not found");
  return -1;
};

let letters = ['a', 'b', 'c', 'b', 'd'];

console.log("indexOf 'b':");
console.log("Result:", letters.myIndexOf('b'));

console.log("\\nindexOf 'b' from 2:");
console.log("Result:", letters.myIndexOf('b', 2));

console.log("\\nindexOf 'z':");
console.log("Result:", letters.myIndexOf('z'));
`,
    approach: 'Linear scan from fromIndex using strict equality to find the first matching element. Handle negative fromIndex by computing the offset from the end. Return the index on the first match, or -1 if the value is not found in the remaining elements.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Array Polyfill',
    whyItWorks: 'IndexOf returns the numeric position of the first occurrence, enabling operations like removing duplicates, finding positions for splice, or checking existence before includes was introduced.',
  },
  {
    id: 'implement-flatmap',
    name: 'Implement Array.flatMap',
    category: 'array-polyfills',
    difficulty: 'medium',
    description: 'Build your own flatMap',
    code: `// Implement Array.flatMap
// flatMap = map + flat(1)

Array.prototype.myFlatMap = function(callback) {
  let result = [];

  for (let i = 0; i < this.length; i++) {
    let mapped = callback(this[i], i, this);
    console.log("Map [" + i + "]:", this[i], "->", mapped);

    if (Array.isArray(mapped)) {
      console.log("  Flatten:", mapped);
      for (let item of mapped) {
        result.push(item);
      }
    } else {
      result.push(mapped);
    }
  }

  return result;
};

console.log("Split words into chars:");
let words = ["hi", "bye"];
let chars = words.myFlatMap(function(w) {
  return w.split('');
});
console.log("Result:", chars);

console.log("\\nDouble each number:");
let nums = [1, 2, 3];
let doubled = nums.myFlatMap(function(n) {
  return [n, n * 2];
});
console.log("Result:", doubled);
`,
    approach: 'Apply the callback to each element (like map), then flatten the result by one level. If the callback returns an array, spread its elements into the result; if it returns a non-array value, push it directly. This combines mapping and flattening in a single pass.',
    timeComplexity: 'O(n * m)',
    spaceComplexity: 'O(n * m)',
    patternName: 'Array Polyfill',
    whyItWorks: 'FlatMap is equivalent to map followed by flat(1) but more efficient as it does both in one iteration. It is ideal when each input element maps to zero, one, or multiple output elements.',
  },
  {
    id: 'implement-concat',
    name: 'Implement Array.concat',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own concat',
    code: `// Implement Array.concat

Array.prototype.myConcat = function(...args) {
  let result = [];

  // Copy original array
  console.log("Copy original:", this);
  for (let item of this) {
    result.push(item);
  }

  // Process each argument
  for (let arg of args) {
    console.log("Concat:", arg);
    if (Array.isArray(arg)) {
      for (let item of arg) {
        result.push(item);
      }
    } else {
      result.push(arg);
    }
  }

  return result;
};

let a = [1, 2];
let b = [3, 4];
let c = [5, 6];

console.log("Concat arrays:");
let merged = a.myConcat(b, c);
console.log("Result:", merged);

console.log("\\nConcat mixed:");
let mixed = a.myConcat(99, [100, 101]);
console.log("Result:", mixed);
`,
    approach: 'Create a new result array, copy all elements from the original array, then iterate through each argument. If an argument is an array, spread its elements individually into the result; if it is a scalar value, push it directly. This produces a new array without mutating the originals.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Concat produces a shallow copy that merges arrays and values into a single flat array. It only flattens one level of array arguments, leaving nested arrays intact.',
  },
  {
    id: 'implement-slice',
    name: 'Implement Array.slice',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own slice',
    code: `// Implement Array.slice

Array.prototype.mySlice = function(start, end) {
  let result = [];
  let len = this.length;

  // Handle defaults and negatives
  let s = start === undefined ? 0 : start;
  let e = end === undefined ? len : end;

  if (s < 0) s = len + s;
  if (e < 0) e = len + e;

  console.log("Array:", this);
  console.log("Slice from", s, "to", e);

  for (let i = s; i < e && i < len; i++) {
    console.log("  Copy [" + i + "]:", this[i]);
    result.push(this[i]);
  }

  return result;
};

let arr = [0, 1, 2, 3, 4, 5];

console.log("slice(2, 4):");
console.log("Result:", arr.mySlice(2, 4));

console.log("\\nslice(-3):");
console.log("Result:", arr.mySlice(-3));

console.log("\\nslice(1, -1):");
console.log("Result:", arr.mySlice(1, -1));
`,
    approach: 'Normalize start and end indices, handling undefined defaults and negative values by adding them to the array length. Iterate from the computed start to end, copying each element into a new result array without modifying the original.',
    timeComplexity: 'O(k)',
    spaceComplexity: 'O(k)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Slice creates a shallow copy of a portion of the array. Negative indices count from the end, enabling patterns like arr.slice(-3) to get the last three elements without knowing the array length.',
  },
  {
    id: 'implement-reverse',
    name: 'Implement Array.reverse',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own reverse (in-place)',
    code: `// Implement Array.reverse (in-place)

Array.prototype.myReverse = function() {
  let left = 0;
  let right = this.length - 1;

  console.log("Original:", this);

  while (left < right) {
    console.log("Swap [" + left + "] and [" + right + "]");

    // Swap elements
    let temp = this[left];
    this[left] = this[right];
    this[right] = temp;

    console.log("  After:", this);

    left = left + 1;
    right = right - 1;
  }

  return this;
};

let nums = [1, 2, 3, 4, 5];
console.log("Reverse numbers:");
nums.myReverse();
console.log("Final:", nums);

console.log("\\nReverse chars:");
let chars = ['a', 'b', 'c', 'd'];
chars.myReverse();
console.log("Final:", chars);
`,
    approach: 'Use two pointers starting at the beginning and end of the array, swapping elements in place and moving the pointers inward until they meet in the middle. This reverses the array with no extra memory allocation. Return this to allow method chaining.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointer Swap',
    whyItWorks: 'Swapping elements from both ends toward the center reverses the array in n/2 swaps. Operating in-place modifies the original array, matching the native reverse behavior.',
  },
  {
    id: 'implement-join',
    name: 'Implement Array.join',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own join',
    code: `// Implement Array.join

Array.prototype.myJoin = function(separator) {
  let sep = separator === undefined ? ',' : separator;
  let result = '';

  console.log("Array:", this);
  console.log("Separator:", JSON.stringify(sep));

  for (let i = 0; i < this.length; i++) {
    if (i > 0) {
      result = result + sep;
    }

    if (this[i] !== null && this[i] !== undefined) {
      result = result + this[i];
    }

    console.log("  After [" + i + "]:", JSON.stringify(result));
  }

  return result;
};

console.log("Default separator:");
console.log("Result:", [1, 2, 3].myJoin());

console.log("\\nCustom separator:");
console.log("Result:", ['a', 'b', 'c'].myJoin(' - '));

console.log("\\nWith null/undefined:");
console.log("Result:", [1, null, 3, undefined, 5].myJoin());
`,
    approach: 'Iterate through the array, concatenating each element to a result string with the separator inserted between elements. Handle the default comma separator when none is provided, and treat null/undefined values as empty strings to match native behavior.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Array Polyfill',
    whyItWorks: 'String concatenation with a conditional separator between elements reproduces the native join behavior, including the edge case of skipping null and undefined values.',
  },
  {
    id: 'implement-fill',
    name: 'Implement Array.fill',
    category: 'array-polyfills',
    difficulty: 'easy',
    description: 'Build your own fill',
    code: `// Implement Array.fill

Array.prototype.myFill = function(value, start, end) {
  let len = this.length;
  let s = start === undefined ? 0 : start;
  let e = end === undefined ? len : end;

  if (s < 0) s = len + s;
  if (e < 0) e = len + e;

  console.log("Fill with:", value);
  console.log("From", s, "to", e);

  for (let i = s; i < e && i < len; i++) {
    console.log("  [" + i + "]:", this[i], "->", value);
    this[i] = value;
  }

  return this;
};

let arr1 = [1, 2, 3, 4, 5];
console.log("fill(0):");
arr1.myFill(0);
console.log("Result:", arr1);

let arr2 = [1, 2, 3, 4, 5];
console.log("\\nfill('x', 1, 4):");
arr2.myFill('x', 1, 4);
console.log("Result:", arr2);

let arr3 = [1, 2, 3, 4, 5];
console.log("\\nfill(9, -2):");
arr3.myFill(9, -2);
console.log("Result:", arr3);
`,
    approach: 'Iterate over the specified range within the array, replacing each element with the given value. Normalize negative start/end indices by adding the array length, and clamp bounds to prevent out-of-range writes. The operation modifies the array in place and returns it.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Array Polyfill',
    whyItWorks: 'Negative index normalization and bounds clamping ensure the fill range is valid, while in-place mutation avoids allocating a new array.',
  },

  // ==================== UTILITY FUNCTIONS ====================
  {
    id: 'implement-debounce',
    name: 'Implement Debounce',
    category: 'utility-functions',
    difficulty: 'medium',
    description: 'Delay until events stop',
    code: `// Debounce - Wait for pause

function debounce(fn, wait) {
  let timeout;
  return function(...args) {
    if (timeout) {
      console.log("  Clear previous");
      clearTimeout(timeout);
    }
    console.log("  Set timeout " + wait + "ms");
    timeout = setTimeout(() => {
      console.log("  Execute!");
      fn.apply(this, args);
    }, wait);
  };
}

function search(q) {
  console.log(">>> Search:", q);
}

let debouncedSearch = debounce(search, 300);

console.log("Typing...");
debouncedSearch('h');
debouncedSearch('he');
debouncedSearch('hel');
debouncedSearch('hello');

console.log("\\nOnly 'hello' triggers after pause");
`,
    approach: 'Return a wrapper function that resets a timer on every call using clearTimeout and setTimeout. The original function only executes after the caller stops invoking for the specified wait period. Use apply to preserve the correct this context and arguments.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Debounce Pattern',
    whyItWorks: 'Each invocation clears the previous timer and starts a new one, so only the last call in a burst of rapid calls actually triggers the function after the wait period elapses.',
  },
  {
    id: 'implement-throttle',
    name: 'Implement Throttle',
    category: 'utility-functions',
    difficulty: 'medium',
    description: 'Limit execution rate',
    code: `// Throttle - Execute at most once per interval

function throttle(fn, wait) {
  let last = 0;
  return function(...args) {
    let now = Date.now();
    if (now - last >= wait) {
      last = now;
      console.log("  Execute");
      fn.apply(this, args);
    } else {
      console.log("  Skip (throttled)");
    }
  };
}

let count = 0;
function handleScroll(pos) {
  count++;
  console.log(">>> Handler #" + count);
}

let throttled = throttle(handleScroll, 200);

console.log("Rapid events:");
for (let i = 0; i < 5; i++) {
  throttled(i);
}

console.log("\\nThrottle limits rate");
`,
    approach: 'Track the timestamp of the last execution. On each call, check whether enough time has elapsed since the last run. If so, execute the function and update the timestamp; otherwise, skip the call. Use apply to preserve context.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Throttle Pattern',
    whyItWorks: 'Comparing Date.now() against the last execution time guarantees the function runs at most once per interval, smoothing rapid event streams like scroll or resize.',
  },
  {
    id: 'implement-deep-clone',
    name: 'Implement Deep Clone',
    category: 'utility-functions',
    difficulty: 'medium',
    description: 'Deep copy objects',
    code: `// Deep Clone

function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);

  if (Array.isArray(obj)) {
    let clone = [];
    seen.set(obj, clone);
    obj.forEach((v, i) => clone[i] = deepClone(v, seen));
    return clone;
  }

  let clone = {};
  seen.set(obj, clone);
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      clone[k] = deepClone(obj[k], seen);
    }
  }
  return clone;
}

let orig = {
  name: 'Alice',
  addr: { city: 'NYC' },
  tags: ['a', 'b']
};

let copy = deepClone(orig);
copy.addr.city = 'LA';
copy.tags.push('c');

console.log("Original:", orig.addr.city, orig.tags);
console.log("Copy:", copy.addr.city, copy.tags);
`,
    approach: 'Recursively traverse the object, creating new arrays and objects at each level and cloning their contents. Use a WeakMap to track already-cloned references, which handles circular references by returning the previously created clone instead of recursing infinitely.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Deep Clone',
    whyItWorks: 'The WeakMap acts as a visited set that maps original objects to their clones, breaking circular reference cycles while ensuring each object is only cloned once.',
  },
  {
    id: 'implement-memoize',
    name: 'Implement Memoize',
    category: 'utility-functions',
    difficulty: 'medium',
    description: 'Cache function results',
    code: `// Memoize - Cache results

function memoize(fn) {
  let cache = new Map();
  return function(...args) {
    let key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("Cache HIT:", key);
      return cache.get(key);
    }
    console.log("Cache MISS:", key);
    let result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

let memoFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return memoFib(n-1) + memoFib(n-2);
});

console.log("fib(10) =", memoFib(10));
console.log("\\nAgain:");
console.log("fib(10) =", memoFib(10));
`,
    approach: 'Return a wrapper that serializes arguments with JSON.stringify to create a cache key. Check if the key exists in a Map; if so, return the cached result. Otherwise, call the original function, store the result in the Map, and return it.',
    timeComplexity: 'O(1) amortized for cache hits',
    spaceComplexity: 'O(n) where n is unique argument combinations',
    patternName: 'Memoization Pattern',
    whyItWorks: 'JSON.stringify creates a deterministic string key from any combination of primitive arguments, and the Map provides O(1) lookup to avoid redundant computation on repeated calls.',
  },
  {
    id: 'implement-once',
    name: 'Implement _.once()',
    category: 'utility-functions',
    difficulty: 'easy',
    description: 'Function that runs only once',
    code: `// Implement _.once()
// Returns a function that ignores subsequent calls

function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (called) {
      console.log("  Already called, returning cached");
      return result;
    }
    called = true;
    console.log("  First call, executing...");
    result = fn.apply(this, args);
    return result;
  };
}

// Test
function init() {
  console.log("  >>> Initializing...");
  return { ready: true };
}

let initOnce = once(init);

console.log("Call 1:");
console.log("  Result:", initOnce());

console.log("\\nCall 2:");
console.log("  Result:", initOnce());

console.log("\\nCall 3:");
console.log("  Result:", initOnce());
`,
    approach: 'Use a closure to track whether the function has been called via a boolean flag. On the first call, execute the function, store the result, and set the flag. On subsequent calls, return the cached result without re-executing.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Once Pattern',
    whyItWorks: 'The closure captures a mutable boolean and result variable that persist across calls, ensuring the wrapped function body runs exactly once regardless of how many times the wrapper is invoked.',
  },
  {
    id: 'implement-memoize-one',
    name: 'Implement memoizeOne()',
    category: 'utility-functions',
    difficulty: 'medium',
    description: 'Cache only the last result',
    code: `// memoizeOne - Only caches the latest result
// Useful for expensive computations with same args

function memoizeOne(fn) {
  let lastArgs = null;
  let lastResult;

  return function(...args) {
    // Check if args are same as last call
    if (lastArgs && args.length === lastArgs.length &&
        args.every((arg, i) => arg === lastArgs[i])) {
      console.log("  Cache HIT (same args)");
      return lastResult;
    }

    console.log("  Cache MISS (new args)");
    lastArgs = args;
    lastResult = fn.apply(this, args);
    return lastResult;
  };
}

// Test
function expensive(a, b) {
  console.log("  Computing", a, "+", b);
  return a + b;
}

let memoized = memoizeOne(expensive);

console.log("Call (1, 2):", memoized(1, 2));
console.log("Call (1, 2):", memoized(1, 2)); // cached
console.log("Call (3, 4):", memoized(3, 4)); // new args
console.log("Call (1, 2):", memoized(1, 2)); // NOT cached!
`,
    approach: 'Store only the most recent arguments and result. On each call, compare the current arguments against the last ones using strict equality. If they match, return the cached result; otherwise, recompute and update the cache with the new arguments and result.',
    timeComplexity: 'O(k) where k is the number of arguments',
    spaceComplexity: 'O(1)',
    patternName: 'Single-Entry Cache',
    whyItWorks: 'Keeping only the last call\'s result uses constant memory while still providing cache hits for the common case of consecutive identical calls, which is typical in React re-renders.',
  },
  {
    id: 'implement-promisify',
    name: 'Implement promisify()',
    category: 'utility-functions',
    difficulty: 'medium',
    description: 'Convert callback to Promise',
    code: `// promisify - Convert callback-based fn to Promise
// Node.js convention: callback(err, result)

function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Simulate callback-style async function
function readFile(name, callback) {
  console.log("Reading file:", name);
  setTimeout(() => {
    if (name === 'error.txt') {
      callback(new Error('File not found'));
    } else {
      callback(null, 'File content: ' + name);
    }
  }, 100);
}

// Convert to Promise-based
let readFileAsync = promisify(readFile);

console.log("Using promisified function:");
readFileAsync('data.txt')
  .then(data => console.log("Success:", data))
  .catch(err => console.log("Error:", err.message));
`,
    approach: 'Return a new function that wraps the original callback-based function in a Promise. Pass all user arguments plus a final callback to the original function. In the callback, reject on error or resolve with the result, following the Node.js (err, result) convention.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Promisify Pattern',
    whyItWorks: 'The adapter appends an error-first callback that bridges the callback world to the Promise world, enabling async/await usage with legacy Node.js-style APIs.',
  },
  {
    id: 'implement-sleep',
    name: 'Implement sleep()',
    category: 'utility-functions',
    difficulty: 'easy',
    description: 'Promise-based delay',
    code: `// sleep - Promise-based delay utility

function sleep(ms) {
  return new Promise(resolve => {
    console.log("Sleeping for " + ms + "ms...");
    setTimeout(resolve, ms);
  });
}

// Test sequential delays
async function demo() {
  console.log("Start:", Date.now() % 10000);

  await sleep(100);
  console.log("After 100ms:", Date.now() % 10000);

  await sleep(200);
  console.log("After 200ms:", Date.now() % 10000);

  console.log("Done!");
}

demo();

// Common use: retry with delay
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    console.log("Attempt", i + 1);
    try {
      // return await fetch(url);
      if (i < 2) throw new Error("Failed");
      return "Success!";
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(100 * (i + 1)); // exponential backoff
    }
  }
}
`,
    approach: 'Return a Promise that resolves after a setTimeout of the specified duration. This allows pausing async functions with await. Combine with a retry loop and exponential backoff to add resilience to network requests.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Sleep Utility',
    whyItWorks: 'Wrapping setTimeout in a Promise converts a callback-based timer into an awaitable expression, enabling clean sequential delays in async/await code without nesting callbacks.',
  },

  // ==================== FUNCTIONAL JS ====================
  {
    id: 'implement-curry',
    name: 'Implement Curry',
    category: 'functional-js',
    difficulty: 'medium',
    description: 'Transform f(a,b,c) to f(a)(b)(c)',
    code: `// Curry

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried(...args, ...more);
  };
}

function add(a, b, c) {
  return a + b + c;
}

let curried = curry(add);

console.log("add(1,2,3):", curried(1,2,3));
console.log("add(1)(2)(3):", curried(1)(2)(3));
console.log("add(1,2)(3):", curried(1,2)(3));

let mult = curry((a, b) => a * b);
let double = mult(2);
console.log("\\ndouble(5):", double(5));
`,
    approach: 'Return a recursive wrapper function that accumulates arguments across calls. Compare the accumulated argument count against the original function\'s arity (fn.length). When enough arguments are collected, invoke the original function; otherwise, return a new function that continues collecting.',
    timeComplexity: 'O(1) per partial call',
    spaceComplexity: 'O(n) where n is the number of arguments',
    patternName: 'Curry Pattern',
    whyItWorks: 'Checking args.length against fn.length determines when all required parameters are present, and the rest/spread operators naturally accumulate arguments across successive partial applications.',
  },
  {
    id: 'implement-compose',
    name: 'Implement Compose',
    category: 'functional-js',
    difficulty: 'medium',
    description: 'Combine functions right-to-left',
    code: `// Compose - f(g(h(x)))

function compose(...fns) {
  return (arg) => fns.reduceRight((r, f) => f(r), arg);
}

let addOne = x => x + 1;
let double = x => x * 2;
let square = x => x * x;

let calc = compose(addOne, double, square);
// square(3)=9, double(9)=18, addOne(18)=19

console.log("compose(addOne, double, square)(3)");
console.log("= addOne(double(square(3)))");
console.log("= addOne(double(9))");
console.log("= addOne(18)");
console.log("=", calc(3));
`,
    approach: 'Accept an array of functions and return a new function that applies them right-to-left using reduceRight. The initial value is the input argument, and each function\'s return value becomes the input to the next.',
    timeComplexity: 'O(n) where n is the number of functions',
    spaceComplexity: 'O(1)',
    patternName: 'Function Composition',
    whyItWorks: 'reduceRight naturally expresses right-to-left evaluation, mirroring the mathematical composition f(g(h(x))) where the rightmost function is applied first.',
  },
  {
    id: 'implement-pipe',
    name: 'Implement Pipe',
    category: 'functional-js',
    difficulty: 'medium',
    description: 'Combine functions left-to-right',
    code: `// Pipe - h(g(f(x)))

function pipe(...fns) {
  return (arg) => fns.reduce((r, f) => f(r), arg);
}

let addOne = x => x + 1;
let double = x => x * 2;
let square = x => x * x;

let calc = pipe(addOne, double, square);
// addOne(3)=4, double(4)=8, square(8)=64

console.log("pipe(addOne, double, square)(3)");
console.log("= square(double(addOne(3)))");
console.log("= square(double(4))");
console.log("= square(8)");
console.log("=", calc(3));
`,
    approach: 'Accept an array of functions and return a new function that applies them left-to-right using reduce. The initial value is the input argument, and each function\'s return value feeds into the next function in the pipeline.',
    timeComplexity: 'O(n) where n is the number of functions',
    spaceComplexity: 'O(1)',
    patternName: 'Pipeline Pattern',
    whyItWorks: 'reduce naturally expresses left-to-right evaluation, making data transformation pipelines read in the order they execute, which is more intuitive than nested function calls.',
  },
  {
    id: 'implement-curry-placeholder',
    name: 'Curry with Placeholder',
    category: 'functional-js',
    difficulty: 'hard',
    description: 'Curry with placeholder support',
    code: `// Curry with placeholder support
// _ is placeholder to skip arguments

const _ = Symbol('placeholder');

function curry(fn) {
  return function curried(...args) {
    // Check if we have enough real arguments
    let complete = args.length >= fn.length &&
      args.slice(0, fn.length).every(a => a !== _);

    if (complete) {
      return fn.apply(this, args);
    }

    return function(...more) {
      // Replace placeholders with new args
      let merged = [];
      let moreIdx = 0;

      for (let arg of args) {
        if (arg === _ && moreIdx < more.length) {
          merged.push(more[moreIdx++]);
        } else {
          merged.push(arg);
        }
      }
      // Append remaining args
      while (moreIdx < more.length) {
        merged.push(more[moreIdx++]);
      }

      return curried(...merged);
    };
  };
}

// Test
function add(a, b, c) {
  return a + b + c;
}

let curried = curry(add);

console.log("add(1,2,3):", curried(1, 2, 3));
console.log("add(1)(2)(3):", curried(1)(2)(3));
console.log("add(_,2)(1,3):", curried(_, 2)(1, 3));
console.log("add(_,_,3)(1)(2):", curried(_, _, 3)(1)(2));
`,
    approach: 'Extend basic currying with a placeholder symbol that marks positions for deferred arguments. On each partial call, merge new arguments into placeholder positions from the previous call. Continue until all positions hold real values and the required arity is met.',
    timeComplexity: 'O(n) per partial call for merging',
    spaceComplexity: 'O(n) where n is the number of arguments',
    patternName: 'Advanced Curry Pattern',
    whyItWorks: 'The placeholder symbol acts as a sentinel value that can be detected and replaced during argument merging, allowing arguments to be supplied in any order across multiple partial applications.',
  },
  {
    id: 'implement-partial',
    name: 'Implement _.partial()',
    category: 'functional-js',
    difficulty: 'medium',
    description: 'Partial application of functions',
    code: `// partial - Pre-fill some arguments
// Unlike curry, returns function expecting rest

function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

// Test
function greet(greeting, name, punct) {
  return greeting + ', ' + name + punct;
}

console.log("Original:");
console.log(greet('Hello', 'Alice', '!'));

let sayHello = partial(greet, 'Hello');
console.log("\\nsayHello('Bob', '?'):");
console.log(sayHello('Bob', '?'));

let greetAlice = partial(greet, 'Hi', 'Alice');
console.log("\\ngreetAlice('.'):");
console.log(greetAlice('.'));

// With placeholder support
const _ = Symbol('_');

function partialWithPlaceholder(fn, ...presetArgs) {
  return function(...laterArgs) {
    let args = [];
    let laterIdx = 0;
    for (let arg of presetArgs) {
      args.push(arg === _ ? laterArgs[laterIdx++] : arg);
    }
    return fn(...args, ...laterArgs.slice(laterIdx));
  };
}

let greet2nd = partialWithPlaceholder(greet, _, 'World');
console.log("\\ngreet(_, 'World')('Bye', '!'):");
console.log(greet2nd('Bye', '!'));
`,
    approach: 'Return a new function that prepends the preset arguments to any later arguments, then calls the original function with the combined list. Extend with placeholder support by scanning preset arguments for a sentinel symbol and replacing those positions with later arguments in order.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n) where n is the preset argument count',
    patternName: 'Partial Application',
    whyItWorks: 'Closures capture the preset arguments so they persist across calls, and spread syntax cleanly concatenates preset and later arguments into a single invocation of the original function.',
  },
  {
    id: 'implement-flat',
    name: 'Implement Array.flat()',
    category: 'functional-js',
    difficulty: 'medium',
    description: 'Flatten nested arrays recursively',
    code: `// Implement Array.prototype.flat()

function flat(arr, depth = 1) {
  let result = [];

  for (let item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flat(item, depth - 1));
    } else {
      result.push(item);
    }
  }

  return result;
}

// Test cases
let nested = [1, [2, [3, [4]]]];

console.log("Original:", JSON.stringify(nested));
console.log("\\nflat(arr, 1):", JSON.stringify(flat(nested, 1)));
console.log("flat(arr, 2):", JSON.stringify(flat(nested, 2)));
console.log("flat(arr, Infinity):", JSON.stringify(flat(nested, Infinity)));

// Edge cases
console.log("\\nEdge cases:");
console.log("Empty:", JSON.stringify(flat([[]])));
console.log("Mixed:", JSON.stringify(flat([1, [2, , 3]])));

// Using reduce
function flatReduce(arr, d = 1) {
  return d > 0
    ? arr.reduce((acc, v) =>
        acc.concat(Array.isArray(v) ? flatReduce(v, d-1) : v), [])
    : arr.slice();
}

console.log("\\nReduce version:");
console.log(JSON.stringify(flatReduce([1, [2, [3]]], 2)));
`,
    approach: 'Recursively iterate through the array. For each element, if it is an array and the remaining depth is greater than zero, recursively flatten it and spread the results. Otherwise, push the element directly. Also implement a reduce-based variant that concatenates flattened sub-arrays.',
    timeComplexity: 'O(n) where n is the total number of elements',
    spaceComplexity: 'O(n)',
    patternName: 'Recursive Flatten',
    whyItWorks: 'The depth parameter controls recursion depth, decrementing by one at each level so that flat(arr, 1) only flattens one level while flat(arr, Infinity) fully flattens all nesting.',
  },
  {
    id: 'implement-flatten-thunk',
    name: 'Flatten Thunk',
    category: 'functional-js',
    difficulty: 'hard',
    description: 'Flatten nested lazy functions',
    code: `// Flatten Thunk
// Thunk = lazy function that delays computation

function flattenThunk(thunk) {
  // Keep calling until not a function
  while (typeof thunk === 'function') {
    console.log("  Unwrapping thunk...");
    thunk = thunk();
  }
  return thunk;
}

// Test
let lazy = () => () => () => 42;

console.log("Nested thunk:", lazy.toString().slice(0, 30) + "...");
console.log("Result:", flattenThunk(lazy));

// Recursive version
function flattenThunkRecursive(thunk) {
  if (typeof thunk !== 'function') return thunk;
  return flattenThunkRecursive(thunk());
}

console.log("\\nRecursive:", flattenThunkRecursive(() => () => 'hello'));

// Real use case: lazy evaluation
function createLazy(value) {
  console.log("Creating lazy with:", value);
  return () => {
    console.log("Evaluating...");
    return value * 2;
  };
}

let lazyCalc = createLazy(21);
console.log("\\nLazy created, not yet evaluated");
console.log("Now evaluating:", flattenThunk(lazyCalc));
`,
    approach: 'Repeatedly invoke the value while it is a function, replacing it with the return value each time. Continue until the result is no longer a function, then return the final non-function value. Also implement a recursive variant that achieves the same result through self-calls.',
    timeComplexity: 'O(d) where d is the nesting depth',
    spaceComplexity: 'O(1) iterative, O(d) recursive',
    patternName: 'Thunk Resolution',
    whyItWorks: 'A thunk is a nullary function wrapping a deferred value, so repeatedly calling it peels away each layer of indirection until the underlying value is reached.',
  },

  // ==================== DOM & EVENTS ====================
  {
    id: 'event-emitter',
    name: 'Event Emitter',
    category: 'dom-events',
    difficulty: 'medium',
    description: 'Pub/sub pattern',
    code: `// Event Emitter - Pub/Sub Pattern

function createEventEmitter() {
  let events = {};

  return {
    on: function(event, cb) {
      if (!events[event]) events[event] = [];
      events[event].push(cb);
      console.log("Subscribed to:", event);
      // Return unsubscribe function
      return function() {
        events[event] = events[event].filter(function(f) {
          return f !== cb;
        });
        console.log("Unsubscribed from:", event);
      };
    },

    emit: function(event, data) {
      console.log("\\nEmit:", event);
      if (!events[event]) return;
      for (let i = 0; i < events[event].length; i++) {
        events[event][i](data);
      }
    }
  };
}

let ee = createEventEmitter();

// Subscribe to events
ee.on('message', function(d) {
  console.log("  Got message:", d);
});

let unsub = ee.on('alert', function(m) {
  console.log("  Alert:", m);
});

// Emit events
ee.emit('message', 'Hello');
ee.emit('alert', 'Warning!');

// Unsubscribe and emit again
unsub();
ee.emit('alert', 'No one listening');
`,
    approach: 'Maintain a dictionary mapping event names to arrays of callback functions. The on method pushes a callback and returns an unsubscribe function that filters it out. The emit method iterates over all callbacks for the given event and invokes each with the provided data.',
    timeComplexity: 'O(n) for emit where n is subscriber count',
    spaceComplexity: 'O(n) for stored callbacks',
    patternName: 'Event Emitter',
    whyItWorks: 'The publish-subscribe pattern decouples event producers from consumers through a shared registry, and returning an unsubscribe closure from on() provides clean lifecycle management.',
  },
  {
    id: 'event-delegation',
    name: 'Event Delegation',
    category: 'dom-events',
    difficulty: 'easy',
    description: 'Efficient event handling',
    code: `// Event Delegation Pattern
// One handler on parent manages all child events

// Store our single handler
let clickHandler = null;

function onEvent(handler) {
  clickHandler = handler;
  console.log("Registered click handler");
}

function simulateClick(action, id) {
  console.log("\\nClick event - action:", action, "id:", id);
  if (clickHandler) {
    clickHandler(action, id);
  }
}

// Register ONE delegated handler
onEvent(function(action, id) {
  if (action === 'delete') {
    console.log("  -> Deleting item", id);
  } else if (action === 'edit') {
    console.log("  -> Editing item", id);
  } else {
    console.log("  -> Unknown action:", action);
  }
});

// Simulate clicks on different items
simulateClick('delete', 1);
simulateClick('edit', 2);
simulateClick('delete', 3);
simulateClick('view', 4);

console.log("\\nOne handler managed all events!");
`,
    approach: 'Register a single event handler on a parent element rather than individual handlers on each child. The handler inspects the event target\'s attributes (such as action and id) to determine which child was clicked and responds accordingly.',
    timeComplexity: 'O(1) per event',
    spaceComplexity: 'O(1)',
    patternName: 'Event Delegation',
    whyItWorks: 'DOM events bubble up from child to parent, so a single parent handler can intercept all child events. This reduces memory usage and automatically handles dynamically added children.',
  },
  {
    id: 'dom-wrapper-chaining',
    name: 'DOM Wrapper with Chaining',
    category: 'dom-events',
    difficulty: 'medium',
    description: 'jQuery-style method chaining',
    code: `// DOM Wrapper with method chaining
// Like jQuery's $() - returns object with chainable methods

function $(selector) {
  let element = { tag: selector, style: {}, classes: [] };
  console.log("Selected:", selector);

  let wrapper = {
    css: function(prop, value) {
      element.style[prop] = value;
      console.log("  Set", prop, "=", value);
      return wrapper; // Enable chaining!
    },

    addClass: function(name) {
      element.classes.push(name);
      console.log("  Added class:", name);
      return wrapper;
    },

    removeClass: function(name) {
      element.classes = element.classes.filter(function(c) {
        return c !== name;
      });
      console.log("  Removed class:", name);
      return wrapper;
    },

    getStyles: function() {
      return element.style;
    },

    getClasses: function() {
      return element.classes;
    }
  };

  return wrapper;
}

// Test method chaining
let box = $('div');

box.css('color', 'red')
   .css('fontSize', '16px')
   .addClass('active')
   .addClass('visible')
   .removeClass('hidden');

console.log("\\nFinal styles:", box.getStyles());
console.log("Classes:", box.getClasses());
`,
    approach: 'Create a wrapper object around a DOM element with methods like css, addClass, and removeClass. Each mutating method modifies the element state and returns the wrapper object itself, enabling jQuery-style fluent method chaining.',
    timeComplexity: 'O(1) per chained method call',
    spaceComplexity: 'O(1)',
    patternName: 'Fluent Interface',
    whyItWorks: 'Returning this (the wrapper) from each method allows consecutive calls to be chained on a single expression, reducing boilerplate and improving readability for DOM manipulation sequences.',
  },
  {
    id: 'find-node-in-tree',
    name: 'Find Node in DOM Trees',
    category: 'dom-events',
    difficulty: 'medium',
    description: 'Find corresponding node in cloned tree',
    code: `// Given same node in Tree A, find it in identical Tree B
// Common in virtual DOM diffing

function findCorrespondingNode(rootA, rootB, target) {
  // Track path from root to target in A
  let path = [];
  let current = target;

  while (current !== rootA && current !== null) {
    let parent = current.parent;
    if (!parent) break;
    let idx = parent.children.indexOf(current);
    path.unshift(idx);
    current = parent;
  }

  console.log("Path from root:", path);

  // Follow same path in B
  let result = rootB;
  for (let idx of path) {
    result = result.children[idx];
    console.log("  Navigate to child", idx);
  }

  return result;
}

// Create two identical trees
function createTree() {
  return {
    val: 'root',
    children: [
      { val: 'A', children: [], parent: null },
      {
        val: 'B',
        children: [
          { val: 'B1', children: [], parent: null },
          { val: 'B2', children: [], parent: null }
        ],
        parent: null
      }
    ]
  };
}

let treeA = createTree();
let treeB = createTree();

// Set parent refs
treeA.children.forEach(c => { c.parent = treeA; });
treeA.children[1].children.forEach(c => { c.parent = treeA.children[1]; });
treeB.children.forEach(c => { c.parent = treeB; });
treeB.children[1].children.forEach(c => { c.parent = treeB.children[1]; });

let targetA = treeA.children[1].children[0]; // B1
console.log("Finding node:", targetA.val);

let found = findCorrespondingNode(treeA, treeB, targetA);
console.log("\\nFound in Tree B:", found.val);
`,
    approach: 'Walk from the target node up to the root in Tree A, recording the child index at each level to build a path. Then follow that same index path from the root of Tree B downward to locate the corresponding node.',
    timeComplexity: 'O(d) where d is the tree depth',
    spaceComplexity: 'O(d) for the path array',
    patternName: 'Tree Path Traversal',
    whyItWorks: 'Since both trees have identical structure, a node\'s position is uniquely identified by its index path from the root. Replaying that path in the clone tree lands on the structurally equivalent node.',
  },
  {
    id: 'dom-tree-height',
    name: 'Get DOM Tree Height',
    category: 'dom-events',
    difficulty: 'easy',
    description: 'Find max depth of DOM tree',
    code: `// Get height/depth of a DOM tree
// Height = longest path from root to leaf

function getTreeHeight(node) {
  if (!node) return 0;
  if (!node.children || node.children.length === 0) {
    return 1;
  }

  let maxChildHeight = 0;
  for (let child of node.children) {
    maxChildHeight = Math.max(maxChildHeight, getTreeHeight(child));
  }

  return 1 + maxChildHeight;
}

// Test with mock DOM
let dom = {
  tag: 'html',
  children: [
    { tag: 'head', children: [
      { tag: 'title', children: [] }
    ]},
    { tag: 'body', children: [
      { tag: 'div', children: [
        { tag: 'p', children: [
          { tag: 'span', children: [] }
        ]}
      ]},
      { tag: 'footer', children: [] }
    ]}
  ]
};

console.log("DOM Structure:");
console.log("html > head > title");
console.log("     > body > div > p > span");
console.log("           > footer");

console.log("\\nTree Height:", getTreeHeight(dom));

// BFS alternative
function getHeightBFS(root) {
  if (!root) return 0;
  let queue = [{ node: root, depth: 1 }];
  let maxDepth = 0;

  while (queue.length) {
    let { node, depth } = queue.shift();
    maxDepth = Math.max(maxDepth, depth);
    for (let c of (node.children || [])) {
      queue.push({ node: c, depth: depth + 1 });
    }
  }
  return maxDepth;
}

console.log("Height (BFS):", getHeightBFS(dom));
`,
    approach: 'Use DFS recursion where each leaf node returns height 1, and each internal node returns 1 plus the maximum height among its children. Also implement a BFS alternative that tracks depth level-by-level using a queue.',
    timeComplexity: 'O(n) where n is the number of nodes',
    spaceComplexity: 'O(h) where h is the tree height',
    patternName: 'Tree Height Calculation',
    whyItWorks: 'Recursively computing 1 + max(children heights) propagates the longest root-to-leaf path upward, while the BFS variant naturally discovers the maximum depth as it processes each level.',
  },
  {
    id: 'get-dom-tags',
    name: 'Get All DOM Tags',
    category: 'dom-events',
    difficulty: 'easy',
    description: 'Collect unique tags in DOM tree',
    code: `// Get all unique tag names in a DOM tree

function getAllTags(root) {
  let tags = new Set();

  function traverse(node) {
    if (!node) return;
    if (node.tag) tags.add(node.tag.toLowerCase());

    for (let child of (node.children || [])) {
      traverse(child);
    }
  }

  traverse(root);
  return [...tags].sort();
}

// Test
let page = {
  tag: 'HTML',
  children: [
    { tag: 'HEAD', children: [
      { tag: 'TITLE', children: [] },
      { tag: 'META', children: [] }
    ]},
    { tag: 'BODY', children: [
      { tag: 'DIV', children: [
        { tag: 'H1', children: [] },
        { tag: 'P', children: [
          { tag: 'SPAN', children: [] },
          { tag: 'A', children: [] }
        ]},
        { tag: 'DIV', children: [
          { tag: 'IMG', children: [] }
        ]}
      ]},
      { tag: 'FOOTER', children: [
        { tag: 'P', children: [] }
      ]}
    ]}
  ]
};

console.log("All unique tags:");
console.log(getAllTags(page));

// Count occurrences
function countTags(root) {
  let counts = {};
  function traverse(node) {
    if (!node) return;
    let tag = (node.tag || '').toLowerCase();
    if (tag) counts[tag] = (counts[tag] || 0) + 1;
    (node.children || []).forEach(traverse);
  }
  traverse(root);
  return counts;
}

console.log("\\nTag counts:");
console.log(countTags(page));
`,
    approach: 'Traverse the tree recursively, adding each node\'s tag name (lowercased) to a Set to collect unique values. Sort the Set into an array for the final result. Extend with a counting variant that uses an object to tally occurrences of each tag.',
    timeComplexity: 'O(n) where n is the number of nodes',
    spaceComplexity: 'O(u) where u is the number of unique tags',
    patternName: 'Tree Traversal Collection',
    whyItWorks: 'A Set automatically deduplicates tag names during traversal, and lowercasing before insertion ensures case-insensitive uniqueness across mixed-case DOM trees.',
  },

  // ==================== OBJECT UTILITIES ====================
  {
    id: 'deep-equal',
    name: 'Deep Equal',
    category: 'object-utils',
    difficulty: 'medium',
    description: 'Compare objects deeply',
    code: `// Deep Equal

function deepEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;

  let keysA = Object.keys(a);
  let keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (let k of keysA) {
    if (!deepEqual(a[k], b[k])) return false;
  }
  return true;
}

console.log("Equal nested:");
console.log(deepEqual(
  { a: 1, b: { c: 2 } },
  { a: 1, b: { c: 2 } }
));

console.log("\\nDifferent:");
console.log(deepEqual(
  { a: 1, b: { c: 2 } },
  { a: 1, b: { c: 3 } }
));

console.log("\\nArrays:");
console.log(deepEqual([1, [2]], [1, [2]]));
`,
    approach: 'Recursively compare two values. First check strict equality for primitives and same-reference objects. Then verify both are objects of the same type with the same number of keys. Finally, recursively compare each key\'s value in both objects.',
    timeComplexity: 'O(n) where n is the total number of nested properties',
    spaceComplexity: 'O(d) where d is the nesting depth',
    patternName: 'Deep Equality Check',
    whyItWorks: 'Short-circuiting on strict equality handles primitives and shared references in O(1), while recursive key-by-key comparison catches structural differences at any depth.',
  },
  {
    id: 'deep-merge',
    name: 'Deep Merge',
    category: 'object-utils',
    difficulty: 'medium',
    description: 'Merge objects recursively',
    code: `// Deep Merge

function deepMerge(...objs) {
  let result = {};
  for (let obj of objs) {
    for (let k in obj) {
      let t = result[k], s = obj[k];
      if (t && s && typeof t === 'object' && typeof s === 'object'
          && !Array.isArray(t) && !Array.isArray(s)) {
        result[k] = deepMerge(t, s);
      } else if (Array.isArray(t) && Array.isArray(s)) {
        result[k] = [...t, ...s];
      } else {
        result[k] = s;
      }
    }
  }
  return result;
}

let config1 = { server: { port: 3000 }, debug: false };
let config2 = { server: { ssl: true }, debug: true };

console.log("Merged:");
console.log(deepMerge(config1, config2));
`,
    approach: 'Iterate over each source object\'s keys. When both target and source values are plain objects, recursively merge them. When both are arrays, concatenate them. Otherwise, the source value overwrites the target. Process multiple sources left to right.',
    timeComplexity: 'O(n) where n is the total number of properties',
    spaceComplexity: 'O(n)',
    patternName: 'Deep Merge',
    whyItWorks: 'Recursing into nested plain objects preserves deeply nested values from both sides, while array concatenation and scalar overwriting handle the other cases predictably.',
  },
  {
    id: 'get-set-nested',
    name: 'Get/Set Nested Property',
    category: 'object-utils',
    difficulty: 'easy',
    description: 'Access deep properties safely',
    code: `// Get/Set Nested Property

function get(obj, path, def) {
  let keys = path.replace(/\\[(\\d+)\\]/g, '.$1').split('.');
  let r = obj;
  for (let k of keys) {
    if (r == null) return def;
    r = r[k];
  }
  return r === undefined ? def : r;
}

function set(obj, path, val) {
  let keys = path.replace(/\\[(\\d+)\\]/g, '.$1').split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]]) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = val;
  return obj;
}

let data = { user: { name: 'Alice', tags: ['a'] } };

console.log("Get:");
console.log(get(data, 'user.name'));
console.log(get(data, 'user.tags[0]'));
console.log(get(data, 'user.missing', 'default'));

console.log("\\nSet:");
let obj = {};
set(obj, 'a.b.c', 42);
console.log(obj);
`,
    approach: 'Parse a dot-notation path (supporting bracket syntax for array indices) into an array of keys. For get, walk the object following each key and return the value or a default. For set, walk and auto-create missing intermediate objects, then assign the value at the final key.',
    timeComplexity: 'O(k) where k is the path depth',
    spaceComplexity: 'O(k) for the parsed key array',
    patternName: 'Nested Property Access',
    whyItWorks: 'Converting bracket notation to dot notation with a regex, then splitting on dots, normalizes all path styles into a uniform key array that can be traversed with a simple loop.',
  },
  {
    id: 'implement-object-assign',
    name: 'Implement Object.assign()',
    category: 'object-utils',
    difficulty: 'easy',
    description: 'Shallow copy object properties',
    code: `// Object.assign - Shallow copy properties

function objectAssign(target, ...sources) {
  if (target == null) {
    throw new TypeError('Cannot convert to object');
  }

  let to = Object(target);

  for (let source of sources) {
    if (source == null) continue;

    // Copy own enumerable properties
    for (let key of Object.keys(source)) {
      to[key] = source[key];
      console.log("  Copy:", key, "=", source[key]);
    }

    // Copy symbol properties
    for (let sym of Object.getOwnPropertySymbols(source)) {
      if (Object.prototype.propertyIsEnumerable.call(source, sym)) {
        to[sym] = source[sym];
      }
    }
  }

  return to;
}

// Test
let defaults = { theme: 'light', fontSize: 14 };
let user = { theme: 'dark', name: 'Alice' };

console.log("Merging...");
let config = objectAssign({}, defaults, user);

console.log("\\nResult:", config);
console.log("Original defaults unchanged:", defaults);

// Note: shallow copy!
let nested = { a: { b: 1 } };
let copy = objectAssign({}, nested);
copy.a.b = 999;
console.log("\\nShallow! Original changed:", nested.a.b);
`,
    approach: 'Iterate over each source object, copying its own enumerable string-keyed properties to the target using Object.keys, and its enumerable symbol-keyed properties using Object.getOwnPropertySymbols. Skip null/undefined sources and throw on null/undefined target.',
    timeComplexity: 'O(n) where n is the total number of properties across sources',
    spaceComplexity: 'O(1) beyond the target object',
    patternName: 'Shallow Copy',
    whyItWorks: 'Copying only own enumerable properties with Object.keys matches the native Object.assign specification, and later sources naturally overwrite earlier ones for the same key.',
  },
  {
    id: 'implement-object-is',
    name: 'Implement Object.is()',
    category: 'object-utils',
    difficulty: 'easy',
    description: 'Strict equality with edge cases',
    code: `// Object.is - Same-value equality
// Unlike ===, handles NaN and -0/+0

function objectIs(a, b) {
  // Handle NaN: NaN === NaN is false, but Object.is(NaN, NaN) is true
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  // Handle -0/+0: -0 === +0 is true, but Object.is(-0, +0) is false
  if (a === 0 && b === 0) {
    return 1/a === 1/b; // 1/-0 = -Infinity, 1/+0 = Infinity
  }

  // All other cases, use strict equality
  return a === b;
}

// Test cases
console.log("=== vs Object.is()");
console.log("-------------------");

console.log("\\nNaN comparison:");
console.log("NaN === NaN:", NaN === NaN);
console.log("Object.is(NaN, NaN):", objectIs(NaN, NaN));

console.log("\\n-0 vs +0:");
console.log("-0 === +0:", -0 === +0);
console.log("Object.is(-0, +0):", objectIs(-0, +0));
console.log("Object.is(-0, -0):", objectIs(-0, -0));

console.log("\\nRegular cases:");
console.log("Object.is(1, 1):", objectIs(1, 1));
console.log("Object.is('a', 'a'):", objectIs('a', 'a'));
console.log("Object.is({}, {}):", objectIs({}, {}));

let obj = {};
console.log("Object.is(obj, obj):", objectIs(obj, obj));
`,
    approach: 'Handle the two edge cases where === gives incorrect results: NaN should equal NaN (use Number.isNaN to detect both), and -0 should not equal +0 (use 1/x to distinguish via Infinity signs). For all other values, fall through to strict equality.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Same-Value Equality',
    whyItWorks: 'The 1/x trick exploits the fact that 1/+0 is Infinity while 1/-0 is -Infinity, distinguishing the two zeros that === considers equal. Number.isNaN correctly identifies NaN which === rejects.',
  },
  {
    id: 'implement-object-create',
    name: 'Implement Object.create()',
    category: 'object-utils',
    difficulty: 'medium',
    description: 'Create object with prototype',
    code: `// Object.create - Create object with specified prototype

function objectCreate(proto, propertiesObject) {
  if (proto !== null && typeof proto !== 'object') {
    throw new TypeError('Object prototype may only be Object or null');
  }

  // Create empty constructor
  function F() {}
  F.prototype = proto;
  let obj = new F();

  // Add properties if provided
  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject);
  }

  // Handle null prototype
  if (proto === null) {
    obj.__proto__ = null;
  }

  return obj;
}

// Test 1: Basic inheritance
let animal = {
  speak() { console.log(this.name, "makes sound"); }
};

let dog = objectCreate(animal);
dog.name = "Rex";
console.log("Dog prototype:", Object.getPrototypeOf(dog) === animal);
dog.speak();

// Test 2: With property descriptors
let cat = objectCreate(animal, {
  name: { value: 'Whiskers', writable: true },
  meow: { value: function() { console.log(this.name, "meows"); } }
});

console.log("\\nCat:");
cat.speak();
cat.meow();

// Test 3: null prototype (no inherited methods)
let bare = objectCreate(null);
bare.x = 1;
console.log("\\nNull prototype:");
console.log("Has toString?", 'toString' in bare);
console.log("Value:", bare.x);
`,
    approach: 'Create a temporary constructor function, set its prototype to the given proto object, and instantiate it with new to produce an object with the correct prototype chain. Optionally apply property descriptors with Object.defineProperties. Handle null prototype as a special case.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Prototype Chain Setup',
    whyItWorks: 'Setting F.prototype before calling new F() leverages JavaScript\'s constructor mechanics to create an object whose [[Prototype]] points to the desired proto, establishing the inheritance chain without a class definition.',
  },
  {
    id: 'implement-object-freeze',
    name: 'Shallow vs Deep Freeze',
    category: 'object-utils',
    difficulty: 'medium',
    description: 'Make objects immutable',
    code: `// Object.freeze is shallow - nested objects still mutable
// Let's implement deep freeze

function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Freeze the object itself
  Object.freeze(obj);
  console.log("Froze:", Object.keys(obj).slice(0, 3).join(', '));

  // Recursively freeze all properties
  for (let key of Object.keys(obj)) {
    let value = obj[key];
    if (value !== null && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return obj;
}

// Test shallow freeze
let config = {
  api: { url: 'http://api.com', timeout: 5000 },
  debug: true
};

Object.freeze(config);
config.debug = false; // Fails silently (or throws in strict)
console.log("After shallow freeze:");
console.log("config.debug:", config.debug); // Still true

// But nested still mutable!
config.api.timeout = 9999;
console.log("config.api.timeout:", config.api.timeout); // 9999!

// Now deep freeze
console.log("\\nDeep freezing...");
let config2 = {
  api: { url: 'http://api.com', timeout: 5000 },
  debug: true
};

deepFreeze(config2);
config2.api.timeout = 1; // Won't work
console.log("\\nAfter deep freeze:");
console.log("config2.api.timeout:", config2.api.timeout); // Still 5000

// Check frozen status
console.log("\\nIs frozen?", Object.isFrozen(config2.api));
`,
    approach: 'Call Object.freeze on the top-level object, then recursively visit every property value. If a value is a non-null object, recursively deep-freeze it as well. This ensures nested objects become immutable, unlike the shallow native Object.freeze.',
    timeComplexity: 'O(n) where n is the total number of nested properties',
    spaceComplexity: 'O(d) where d is the nesting depth',
    patternName: 'Deep Freeze',
    whyItWorks: 'Object.freeze only prevents direct property modifications on the frozen object itself. Recursing into nested objects applies the same restriction at every level, making the entire object tree truly immutable.',
  },

  // ==================== PROMISE POLYFILLS ====================
  {
    id: 'promise-all',
    name: 'Implement Promise.all',
    category: 'promise-polyfills',
    difficulty: 'medium',
    description: 'Parallel execution',
    code: `// Promise.all

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    let results = [];
    let done = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(v => {
        results[i] = v;
        done++;
        console.log("Done:", i, "->", v);
        if (done === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}

function delay(ms, v) {
  return new Promise(r => setTimeout(() => r(v), ms));
}

promiseAll([
  delay(100, 'A'),
  delay(50, 'B'),
  delay(150, 'C')
]).then(r => console.log("\\nAll:", r));
`,
    approach: 'Return a new Promise that tracks an array of results and a completion counter. For each input promise, attach a then handler that stores the resolved value at the correct index and increments the counter. Resolve when the counter reaches the total; reject immediately on any failure.',
    timeComplexity: 'O(n) where n is the number of promises',
    spaceComplexity: 'O(n) for the results array',
    patternName: 'Promise.all Polyfill',
    whyItWorks: 'Storing results by index rather than push order preserves the original promise ordering, and the counter ensures we wait for all promises regardless of which resolves first.',
  },
  {
    id: 'promise-race',
    name: 'Implement Promise.race',
    category: 'promise-polyfills',
    difficulty: 'easy',
    description: 'First to settle wins',
    code: `// Promise.race

function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p).then(resolve).catch(reject);
    });
  });
}

function delay(ms, v) {
  return new Promise(r => {
    console.log("Start:", v, ms + "ms");
    setTimeout(() => r(v), ms);
  });
}

promiseRace([
  delay(100, 'Slow'),
  delay(50, 'Fast'),
  delay(200, 'Slower')
]).then(w => console.log("\\nWinner:", w));
`,
    approach: 'Wrap all promises in a new Promise and attach resolve/reject handlers to each one. The first promise to settle (fulfill or reject) triggers the outer promise, making it a race to the finish.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Promise Combinator',
    whyItWorks: 'Since Promise.resolve/reject can only be called once, the first promise to settle wins and all subsequent settlements are ignored.',
  },
  {
    id: 'promisify',
    name: 'Implement Promisify',
    category: 'promise-polyfills',
    difficulty: 'medium',
    description: 'Convert callbacks to promises',
    code: `// Promisify

function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

function readFile(name, cb) {
  console.log("Reading:", name);
  setTimeout(() => {
    if (name === 'error') cb(new Error('Not found'));
    else cb(null, 'Content of ' + name);
  }, 100);
}

let readAsync = promisify(readFile);

readAsync('test.txt').then(c => console.log("Got:", c));
readAsync('error').catch(e => console.log("Error:", e.message));
`,
    approach: 'Return a wrapper function that accepts the same arguments plus appends a Node-style callback. Inside, create a new Promise and route the callback err to reject and result to resolve. This bridges callback-based APIs to promise-based code.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Promise Wrapper',
    whyItWorks: 'Node.js callbacks follow the (err, result) convention, so the wrapper can reliably detect success vs failure and translate it into promise resolution or rejection.',
  },
  {
    id: 'promise-allsettled',
    name: 'Implement Promise.allSettled',
    category: 'promise-polyfills',
    difficulty: 'medium',
    description: 'Wait for all promises regardless of outcome',
    code: `// Promise.allSettled
// Returns array of results for ALL promises (fulfilled or rejected)

function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    let results = [];
    let count = 0;

    if (promises.length === 0) {
      resolve([]);
      return;
    }

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => {
          results[i] = { status: 'fulfilled', value };
          console.log(i, "fulfilled:", value);
        })
        .catch(reason => {
          results[i] = { status: 'rejected', reason };
          console.log(i, "rejected:", reason);
        })
        .finally(() => {
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        });
    });
  });
}

function delay(ms, val, shouldFail = false) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (shouldFail) rej("Error: " + val);
      else res(val);
    }, ms);
  });
}

console.log("=== Testing allSettled ===");
promiseAllSettled([
  delay(50, 'A'),
  delay(100, 'B', true),  // This will reject
  delay(75, 'C')
]).then(results => {
  console.log("\\nAll settled:");
  results.forEach(r => console.log(r));
});
`,
    approach: 'Return a new Promise that never rejects early. For each input promise, attach both a then and catch handler that record the outcome as a {status, value} or {status, reason} object at the correct index. Use a counter to resolve the outer promise once all have settled.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Promise Combinator',
    whyItWorks: 'By catching rejections locally and converting them into result objects, no single rejection can short-circuit the aggregation, guaranteeing all outcomes are collected.',
  },
  {
    id: 'promise-any',
    name: 'Implement Promise.any',
    category: 'promise-polyfills',
    difficulty: 'medium',
    description: 'First fulfilled promise wins',
    code: `// Promise.any
// Resolves with first fulfilled promise, rejects only if ALL reject

function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    let errors = [];
    let rejectedCount = 0;

    if (promises.length === 0) {
      reject(new AggregateError([], 'All promises rejected'));
      return;
    }

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => {
          console.log(i, "fulfilled first!");
          resolve(value);
        })
        .catch(err => {
          errors[i] = err;
          rejectedCount++;
          console.log(i, "rejected:", err);

          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, 'All promises rejected'));
          }
        });
    });
  });
}

function delay(ms, val, shouldFail = false) {
  return new Promise((res, rej) => {
    console.log("Start:", val);
    setTimeout(() => {
      if (shouldFail) rej("Fail:" + val);
      else res(val);
    }, ms);
  });
}

console.log("=== First success wins ===");
promiseAny([
  delay(100, 'Slow', true),
  delay(50, 'Fast', true),
  delay(75, 'Medium')
]).then(v => console.log("\\nWinner:", v))
  .catch(e => console.log("All failed"));
`,
    approach: 'Resolve with the first fulfilled promise value, ignoring rejections until all have failed. Track rejected count and store errors by index. Only reject with an AggregateError when every promise has rejected.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Promise Combinator',
    whyItWorks: 'The first fulfillment short-circuits to resolve the outer promise, while rejections are silently collected. Only when all promises reject does the aggregate error surface.',
  },
  {
    id: 'promise-finally',
    name: 'Implement Promise.finally',
    category: 'promise-polyfills',
    difficulty: 'easy',
    description: 'Always runs after promise settled',
    code: `// Promise.prototype.finally
// Runs callback regardless of outcome, passes through result

Promise.prototype.myFinally = function(callback) {
  return this.then(
    // On fulfill: run callback, then return original value
    value => Promise.resolve(callback()).then(() => value),
    // On reject: run callback, then re-throw
    reason => Promise.resolve(callback()).then(() => { throw reason; })
  );
};

function fetchData(shouldFail) {
  return new Promise((resolve, reject) => {
    console.log("Fetching data...");
    setTimeout(() => {
      if (shouldFail) reject(new Error("Network error"));
      else resolve({ data: "Success!" });
    }, 100);
  });
}

console.log("=== Success case ===");
fetchData(false)
  .then(d => console.log("Data:", d))
  .myFinally(() => console.log("Cleanup done!"));

console.log("\\n=== Failure case ===");
fetchData(true)
  .then(d => console.log("Data:", d))
  .catch(e => console.log("Error:", e.message))
  .myFinally(() => console.log("Cleanup done!"));
`,
    approach: 'Implement then() with two handlers: on fulfill, run the callback via Promise.resolve then return the original value; on reject, run the callback then re-throw. This ensures the callback always executes while the original result or error passes through unchanged.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Promise Wrapper',
    whyItWorks: 'Wrapping the callback in Promise.resolve handles both sync and async callbacks, while returning the original value or re-throwing preserves the promise chain semantics.',
  },
  {
    id: 'promise-retry',
    name: 'Auto-retry Promise',
    category: 'promise-polyfills',
    difficulty: 'medium',
    description: 'Retry failed promises automatically',
    code: `// Auto-retry Promise on rejection
// Retry a promise-returning function up to n times

function retry(fn, retries = 3, delay = 100) {
  return new Promise((resolve, reject) => {
    let attempt = 1;

    function tryOnce() {
      console.log("Attempt", attempt, "of", retries);

      fn()
        .then(resolve)
        .catch(err => {
          console.log("Failed:", err.message);

          if (attempt >= retries) {
            reject(new Error("Max retries reached"));
            return;
          }

          attempt++;
          console.log("Retrying in", delay + "ms...");
          setTimeout(tryOnce, delay);
        });
    }

    tryOnce();
  });
}

// Simulate flaky API (fails first 2 times)
let callCount = 0;
function flakyAPI() {
  callCount++;
  return new Promise((resolve, reject) => {
    if (callCount < 3) {
      reject(new Error("Server busy"));
    } else {
      resolve({ data: "Success on attempt " + callCount });
    }
  });
}

console.log("=== Retry Demo ===");
retry(flakyAPI, 5, 50)
  .then(r => console.log("\\nResult:", r))
  .catch(e => console.log("\\nFailed:", e.message));
`,
    approach: 'Accept a promise-returning function, a max retry count, and a delay between retries. On rejection, increment the attempt counter and schedule a recursive retry after the delay. Resolve on first success or reject when max retries are exhausted.',
    timeComplexity: 'O(r) where r is the number of retries',
    spaceComplexity: 'O(1)',
    patternName: 'Promise Retry',
    whyItWorks: 'Recursive scheduling via setTimeout creates a chain of attempts with a cooldown period, giving transient failures a chance to recover before exhausting the retry budget.',
  },
  {
    id: 'promise-timeout',
    name: 'Promise with Timeout',
    category: 'promise-polyfills',
    difficulty: 'easy',
    description: 'Reject if promise takes too long',
    code: `// Promise with Timeout
// Race between promise and timeout

function withTimeout(promise, ms) {
  let timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout after " + ms + "ms"));
    }, ms);
  });

  return Promise.race([promise, timeout]);
}

function slowAPI(delay) {
  return new Promise(resolve => {
    console.log("API call started, will take", delay + "ms");
    setTimeout(() => resolve("API Response"), delay);
  });
}

console.log("=== Fast enough ===");
withTimeout(slowAPI(50), 100)
  .then(r => console.log("Got:", r))
  .catch(e => console.log("Error:", e.message));

console.log("\\n=== Too slow ===");
withTimeout(slowAPI(200), 100)
  .then(r => console.log("Got:", r))
  .catch(e => console.log("Error:", e.message));
`,
    approach: 'Create a timeout promise that rejects after the specified milliseconds, then race it against the original promise using Promise.race. Whichever settles first determines the outcome.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Promise Wrapper',
    whyItWorks: 'Promise.race resolves or rejects as soon as either the real promise or the timeout promise settles, providing a simple deadline mechanism.',
  },
  {
    id: 'promise-throttle',
    name: 'Throttle Promises',
    category: 'promise-polyfills',
    difficulty: 'hard',
    description: 'Limit concurrent promise execution',
    code: `// Throttle Promises
// Run max N promises concurrently

function throttlePromises(funcs, max) {
  return new Promise((resolve) => {
    let results = [];
    let running = 0;
    let index = 0;

    function runNext() {
      while (running < max && index < funcs.length) {
        let i = index++;
        running++;
        console.log("Start task", i, "(running:", running + ")");

        funcs[i]()
          .then(result => {
            results[i] = result;
            console.log("Done task", i, "->", result);
          })
          .finally(() => {
            running--;
            if (index < funcs.length) {
              runNext();
            } else if (running === 0) {
              resolve(results);
            }
          });
      }
    }

    runNext();
  });
}

function createTask(id, ms) {
  return () => new Promise(r => setTimeout(() => r("Task" + id), ms));
}

let tasks = [
  createTask(1, 100),
  createTask(2, 50),
  createTask(3, 150),
  createTask(4, 75),
  createTask(5, 60)
];

console.log("=== Max 2 concurrent ===");
throttlePromises(tasks, 2).then(r => {
  console.log("\\nAll done:", r);
});
`,
    approach: 'Maintain a running count and a queue index. Launch tasks up to the concurrency limit. When each task completes, decrement the running count and launch the next queued task. Resolve the outer promise when all tasks finish and none are running.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Promise Pool',
    whyItWorks: 'The runNext function acts as a semaphore, only allowing max concurrent tasks at any time while draining the queue as slots free up.',
  },
  {
    id: 'promise-sequence',
    name: 'Sequence Async Tasks',
    category: 'promise-polyfills',
    difficulty: 'medium',
    description: 'Run promises sequentially',
    code: `// Sequence - Run promises one after another
// Each task waits for previous to complete

function sequence(funcs) {
  return funcs.reduce((promise, fn) => {
    return promise.then(results => {
      console.log("Starting next task...");
      return fn().then(result => {
        console.log("Got:", result);
        return [...results, result];
      });
    });
  }, Promise.resolve([]));
}

function createTask(id, ms) {
  return () => new Promise(resolve => {
    console.log("Task", id, "running for", ms + "ms");
    setTimeout(() => resolve("Result" + id), ms);
  });
}

let tasks = [
  createTask(1, 100),
  createTask(2, 50),
  createTask(3, 75)
];

console.log("=== Sequential Execution ===");
sequence(tasks).then(results => {
  console.log("\\nAll results:", results);
});
`,
    approach: 'Use Array.reduce to chain promise-returning functions sequentially. Start with Promise.resolve([]) as the seed, and in each iteration call fn().then() to execute the next task only after the previous one resolves. Accumulate results in the carried array.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Promise Chain',
    whyItWorks: 'Each reduce iteration returns a promise that chains onto the previous one, creating a linear dependency graph that ensures strictly sequential execution.',
  },
  {
    id: 'create-promise',
    name: 'Create Your Own Promise',
    category: 'promise-polyfills',
    difficulty: 'hard',
    description: 'Implement Promise from scratch',
    code: `// Create Your Own Promise (Simplified)
// Implements basic then/catch chaining

class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.handlers = [];

    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      console.log("Resolved:", value);
      this.handlers.forEach(h => h.onFulfill(value));
    };

    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      console.log("Rejected:", reason);
      this.handlers.forEach(h => h.onReject(reason));
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfill, onReject) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        try {
          if (this.state === 'fulfilled') {
            let result = onFulfill ? onFulfill(this.value) : this.value;
            resolve(result);
          } else if (this.state === 'rejected') {
            if (onReject) resolve(onReject(this.value));
            else reject(this.value);
          }
        } catch (e) {
          reject(e);
        }
      };

      if (this.state === 'pending') {
        this.handlers.push({ onFulfill: () => handle(), onReject: () => handle() });
      } else {
        setTimeout(handle, 0);
      }
    });
  }

  catch(onReject) {
    return this.then(null, onReject);
  }
}

console.log("=== Testing MyPromise ===");
new MyPromise((resolve) => {
  setTimeout(() => resolve(42), 100);
})
.then(v => {
  console.log("First then:", v);
  return v * 2;
})
.then(v => console.log("Second then:", v));
`,
    approach: 'Implement a simplified Promise class with pending/fulfilled/rejected states and a handlers queue. The constructor runs the executor synchronously, calling resolve or reject to transition state. The then method returns a new MyPromise, queuing handlers if still pending or scheduling them asynchronously if already settled.',
    timeComplexity: 'O(n) where n is the handler chain length',
    spaceComplexity: 'O(n)',
    patternName: 'Promise Implementation',
    whyItWorks: 'State machine semantics ensure a promise transitions only once, and deferred handler execution via the queue guarantees then callbacks registered before settlement are invoked when the value becomes available.',
  },

  // ==================== BIT MANIPULATION ====================
  {
    id: 'single-number',
    name: 'Single Number',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Find the element that appears only once when all others appear twice using XOR',
    code: `// Single Number - XOR Solution
// Key insight: a ^ a = 0 and a ^ 0 = a
// XOR all elements, pairs cancel out

function singleNumber(nums) {
  let result = 0;

  for (let i = 0; i < nums.length; i++) {
    console.log("XOR:", result, "^", nums[i]);
    result = result ^ nums[i];
    console.log("Result:", result);
  }

  return result;
}

let nums = [4, 1, 2, 1, 2];
console.log("Array:", nums);
console.log("\\nFinding single number...\\n");
let answer = singleNumber(nums);
console.log("\\nSingle number:", answer);
`,
    approach: 'XOR all elements together in a single pass. Since XOR is self-inverse (a ^ a = 0) and commutative, every duplicate pair cancels out, leaving only the unique element.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'XOR Pattern',
    whyItWorks: 'XOR of a number with itself is zero, and XOR with zero is the number itself, so all paired duplicates vanish and the lone element remains.',
  },
  {
    id: 'number-of-1-bits',
    name: 'Number of 1 Bits',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Count the number of set bits (1s) in a binary number (Hamming Weight)',
    code: `// Number of 1 Bits (Hamming Weight)
// Trick: n & (n-1) clears the lowest set bit

function hammingWeight(n) {
  let count = 0;

  while (n !== 0) {
    console.log("n =", n, "| Removing lowest 1 bit");
    n = n & (n - 1);
    count = count + 1;
    console.log("After: n =", n, "| count =", count);
  }

  return count;
}

let num = 11; // Binary: 1011
console.log("Number:", num, "(binary: 1011)");
console.log("\\nCounting 1 bits...\\n");
let bits = hammingWeight(num);
console.log("\\nTotal 1 bits:", bits);
`,
    approach: 'Use Brian Kernighan\'s algorithm: repeatedly clear the lowest set bit with n & (n - 1) and increment a counter. The loop runs exactly as many times as there are 1-bits.',
    timeComplexity: 'O(k) where k is the number of set bits',
    spaceComplexity: 'O(1)',
    patternName: 'Brian Kernighan\'s Algorithm',
    whyItWorks: 'Subtracting 1 flips all bits from the lowest set bit downward, so ANDing with the original clears exactly one set bit per iteration.',
  },
  {
    id: 'counting-bits',
    name: 'Counting Bits',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Return array where ans[i] is the number of 1s in binary of i',
    code: `// Counting Bits (0 to n)
// DP: ans[i] = ans[i >> 1] + (i & 1)
// i >> 1 is i/2, (i & 1) checks if odd

function countBits(n) {
  let ans = [0];

  for (let i = 1; i <= n; i++) {
    let half = i >> 1;
    let isOdd = i & 1;
    ans[i] = ans[half] + isOdd;
    console.log("i=" + i + ": bits[" + half + "] + " + isOdd + " = " + ans[i]);
  }

  return ans;
}

let n = 5;
console.log("Count bits from 0 to", n);
console.log("");
let result = countBits(n);
console.log("\\nResult:", result);
`,
    approach: 'Build a DP table where ans[i] reuses the already-computed count for i >> 1 (integer division by 2) and adds 1 if i is odd (i & 1). This avoids recomputing bit counts from scratch for each number.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Bit Counting DP',
    whyItWorks: 'Right-shifting by 1 removes the least significant bit, and that bit count is already stored in the table. Adding back whether the removed bit was 1 completes the count.',
  },
  {
    id: 'reverse-bits',
    name: 'Reverse Bits',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Reverse bits of a 32-bit unsigned integer',
    code: `// Reverse Bits
// Extract each bit, build result in reverse order

function reverseBits(n) {
  let result = 0;

  for (let i = 0; i < 32; i++) {
    let bit = n & 1;
    result = (result << 1) | bit;
    n = n >> 1;

    if (i < 8) {
      console.log("Bit", i + ":", bit, "| result:", result);
    }
  }

  return result;
}

let num = 43261596;
console.log("Original:", num);
console.log("\\nReversing bits (showing first 8)...\\n");
let reversed = reverseBits(num);
console.log("\\n...\\nReversed:", reversed);
`,
    approach: 'Iterate through all 32 bit positions. For each position, extract the lowest bit of n with n & 1, shift the result left by 1 and OR in the extracted bit, then right-shift n. This builds the reversed number one bit at a time.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Bit Shifting',
    whyItWorks: 'Each iteration moves one bit from the least significant end of the input to the most significant end of the result, effectively mirroring the entire 32-bit representation.',
  },
  {
    id: 'missing-number',
    name: 'Missing Number',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Find the missing number in array [0, n] using XOR',
    code: `// Missing Number - XOR Solution
// XOR indices 0..n with all array values
// Pairs cancel, leaving the missing number

function missingNumber(nums) {
  let xor = nums.length;
  console.log("Start with n =", xor);

  for (let i = 0; i < nums.length; i++) {
    xor = xor ^ i ^ nums[i];
    console.log("XOR with i=" + i + ", nums[i]=" + nums[i] + " => " + xor);
  }

  return xor;
}

let nums = [3, 0, 1];
console.log("Array:", nums);
console.log("Range: [0, 1, 2, 3]");
console.log("\\nFinding missing...\\n");
let missing = missingNumber(nums);
console.log("\\nMissing number:", missing);
`,
    approach: 'Initialize XOR with n (the array length). Then XOR every index 0..n-1 and every array value together. All present numbers pair with their index and cancel out, leaving only the missing number.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'XOR Pattern',
    whyItWorks: 'XOR-ing indices 0..n with all array values creates matched pairs for every number except the missing one, and paired XOR cancels to zero.',
  },
  {
    id: 'power-of-two',
    name: 'Power of Two',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Check if a number is a power of two',
    code: `// Power of Two
// Power of 2 has exactly one 1 bit
// n & (n-1) clears lowest bit, should give 0

function isPowerOfTwo(n) {
  if (n <= 0) {
    console.log(n, "is not positive");
    return false;
  }

  let check = n & (n - 1);
  console.log("n =", n);
  console.log("n - 1 =", n - 1);
  console.log("n & (n-1) =", check);

  return check === 0;
}

console.log("=== Test 16 ===");
console.log("Is power of 2?", isPowerOfTwo(16));

console.log("\\n=== Test 18 ===");
console.log("Is power of 2?", isPowerOfTwo(18));

console.log("\\n=== Test 1 ===");
console.log("Is power of 2?", isPowerOfTwo(1));
`,
    approach: 'A power of two in binary has exactly one set bit. Check that n is positive, then verify n & (n - 1) equals zero. This expression clears the single set bit, leaving zero only for powers of two.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Bit Manipulation',
    whyItWorks: 'Powers of two are the only positive integers with a single 1-bit, so n & (n - 1) which clears the lowest set bit will produce zero exclusively for them.',
  },
  {
    id: 'sum-of-two-integers',
    name: 'Sum of Two Integers',
    category: 'bit-manipulation',
    difficulty: 'medium',
    description: 'Add two integers without using + or - operators',
    code: `// Sum Without + or -
// XOR gives sum without carry
// AND << 1 gives the carry bits

function getSum(a, b) {
  console.log("Adding", a, "and", b);

  while (b !== 0) {
    let carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
    console.log("Sum:", a, "| Carry:", b);
  }

  return a;
}

console.log("=== Test 1: 5 + 3 ===");
let sum1 = getSum(5, 3);
console.log("Result:", sum1);

console.log("\\n=== Test 2: 7 + 8 ===");
let sum2 = getSum(7, 8);
console.log("Result:", sum2);
`,
    approach: 'Simulate binary addition without arithmetic operators. XOR gives the sum bits without carry, and AND shifted left gives the carry bits. Repeat until there is no carry left.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Bit Arithmetic',
    whyItWorks: 'XOR performs addition ignoring carries, while AND identifies positions where both bits are 1 (carry). Shifting the carry left and repeating propagates all carries to completion.',
  },
  {
    id: 'single-number-ii',
    name: 'Single Number II',
    category: 'bit-manipulation',
    difficulty: 'medium',
    description: 'Find element appearing once when others appear 3 times',
    code: `// Single Number II
// Count bits at each position mod 3

function singleNumber(nums) {
  let result = 0;

  for (let i = 0; i < 32; i++) {
    let sum = 0;

    for (let j = 0; j < nums.length; j++) {
      sum = sum + ((nums[j] >> i) & 1);
    }

    let bit = sum % 3;
    result = result | (bit << i);

    if (sum > 0) {
      console.log("Bit", i, ": sum=" + sum, "mod3=" + bit);
    }
  }

  return result;
}

let nums = [2, 2, 3, 2];
console.log("Array:", nums);
console.log("\\nCounting bits mod 3...\\n");
let answer = singleNumber(nums);
console.log("\\nSingle number:", answer);
`,
    approach: 'For each of the 32 bit positions, sum that bit across all numbers. Take the sum modulo 3 to isolate the unique element\'s bit at that position. Reconstruct the result by OR-ing each surviving bit back into place.',
    timeComplexity: 'O(32n)',
    spaceComplexity: 'O(1)',
    patternName: 'Bit Counting',
    whyItWorks: 'Every number appearing three times contributes a multiple of 3 to each bit position sum, so mod 3 eliminates their contribution and reveals only the single element\'s bits.',
  },
  {
    id: 'single-number-iii',
    name: 'Single Number III',
    category: 'bit-manipulation',
    difficulty: 'medium',
    description: 'Find two elements appearing once when others appear twice',
    code: `// Single Number III
// XOR all to get a^b, split by differing bit

function singleNumber(nums) {
  let xorAll = 0;
  for (let i = 0; i < nums.length; i++) {
    xorAll = xorAll ^ nums[i];
  }
  console.log("XOR of all:", xorAll);

  // Find rightmost set bit
  let rightBit = xorAll & (0 - xorAll);
  console.log("Rightmost diff bit:", rightBit);

  let a = 0;
  let b = 0;

  for (let i = 0; i < nums.length; i++) {
    if ((nums[i] & rightBit) !== 0) {
      a = a ^ nums[i];
    } else {
      b = b ^ nums[i];
    }
  }

  console.log("Group 1 result:", a);
  console.log("Group 2 result:", b);

  return [a, b];
}

let nums = [1, 2, 1, 3, 2, 5];
console.log("Array:", nums);
console.log("\\nSplitting by XOR...\\n");
let result = singleNumber(nums);
console.log("\\nTwo singles:", result);
`,
    approach: 'XOR all elements to get a ^ b where a and b are the two unique numbers. Find the rightmost set bit in a ^ b to use as a splitter, then partition all numbers into two groups by that bit. XOR within each group isolates one unique number per group.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'XOR Pattern',
    whyItWorks: 'The differing bit guarantees a and b land in separate groups, while all duplicate pairs stay together within the same group and cancel via XOR.',
  },
  {
    id: 'bitwise-and-range',
    name: 'Bitwise AND of Range',
    category: 'bit-manipulation',
    difficulty: 'medium',
    description: 'Find bitwise AND of all numbers in range [left, right]',
    code: `// Bitwise AND of Numbers Range
// Find common prefix of left and right

function rangeBitwiseAnd(left, right) {
  let shift = 0;

  console.log("Finding common prefix...");
  console.log("Left:", left, "Right:", right);

  while (left < right) {
    left = left >> 1;
    right = right >> 1;
    shift = shift + 1;
    console.log("Shift", shift, ": L=" + left, "R=" + right);
  }

  let result = left << shift;
  console.log("\\nPrefix:", left, "shifted:", result);

  return result;
}

console.log("=== Test: AND of [5, 7] ===");
let r1 = rangeBitwiseAnd(5, 7);
console.log("Result:", r1);
`,
    approach: 'Right-shift both left and right until they are equal, counting the shifts. The common prefix is the bits shared by all numbers in the range. Shift the prefix back left to restore the original bit positions with zeros filling the lower bits.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    patternName: 'Bit Shifting',
    whyItWorks: 'Any bit position where left and right differ will have at least one number in the range with a 0 at that position, causing AND to produce 0. Only the shared prefix survives.',
  },
  {
    id: 'number-complement',
    name: 'Number Complement',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Flip all bits in binary representation',
    code: `// Number Complement
// XOR with mask of all 1s (same bit length)

function findComplement(num) {
  console.log("Number:", num);

  // Count bits
  let bits = 0;
  let temp = num;
  while (temp > 0) {
    bits = bits + 1;
    temp = temp >> 1;
  }
  console.log("Bits needed:", bits);

  // Create mask
  let mask = (1 << bits) - 1;
  console.log("Mask:", mask);

  let result = num ^ mask;
  console.log("num XOR mask:", result);

  return result;
}

console.log("=== Test: 5 (101) ===");
let c1 = findComplement(5);
console.log("Complement:", c1, "(010 = 2)");

console.log("\\n=== Test: 1 ===");
let c2 = findComplement(1);
console.log("Complement:", c2);
`,
    approach: 'Count the number of significant bits in the number, then create a mask of all 1s with that length using (1 << bits) - 1. XOR the number with the mask to flip every bit within the significant range.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    patternName: 'Bit Masking',
    whyItWorks: 'XOR with a mask of all 1s flips each bit (0 becomes 1, 1 becomes 0), producing the complement within the number\'s actual bit width rather than the full 32-bit width.',
  },
  {
    id: 'power-of-four',
    name: 'Power of Four',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Check if a number is a power of four',
    code: `// Power of Four
// Must be power of 2 AND 1-bit at even position
// Mask 0x55555555 = 01010101... (even positions)

function isPowerOfFour(n) {
  if (n <= 0) {
    console.log(n, "is not positive");
    return false;
  }

  let isPow2 = (n & (n - 1)) === 0;
  console.log("n =", n);
  console.log("Is power of 2?", isPow2);

  if (!isPow2) return false;

  // 1431655765 = 0x55555555
  let mask = 1431655765;
  let atEvenPos = (n & mask) !== 0;
  console.log("Bit at even position?", atEvenPos);

  return atEvenPos;
}

console.log("=== Test: 16 ===");
console.log("Is power of 4?", isPowerOfFour(16));

console.log("\\n=== Test: 8 ===");
console.log("Is power of 4?", isPowerOfFour(8));
`,
    approach: 'First check if n is a power of two using n & (n - 1) === 0. Then verify the single set bit is at an even position (bit 0, 2, 4, ...) by ANDing with the mask 0x55555555 which has 1s at all even bit positions.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Bit Masking',
    whyItWorks: 'Powers of four are powers of two where the set bit falls at an even index (4^0=bit 0, 4^1=bit 2, 4^2=bit 4). The 0x55555555 mask isolates exactly those positions.',
  },
  {
    id: 'alternating-bits',
    name: 'Alternating Bits',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Check if binary has alternating bits (101010...)',
    code: `// Alternating Bits
// n XOR (n >> 1) should be all 1s if alternating

function hasAlternatingBits(n) {
  console.log("Number:", n);

  let xor = n ^ (n >> 1);
  console.log("n XOR (n >> 1) =", xor);

  // Check if all 1s: xor & (xor + 1) === 0
  let check = xor & (xor + 1);
  console.log("xor & (xor + 1) =", check);

  return check === 0;
}

console.log("=== Test: 5 (101) ===");
console.log("Alternating?", hasAlternatingBits(5));

console.log("\\n=== Test: 7 (111) ===");
console.log("Alternating?", hasAlternatingBits(7));

console.log("\\n=== Test: 10 (1010) ===");
console.log("Alternating?", hasAlternatingBits(10));
`,
    approach: 'XOR n with n >> 1. If bits alternate, adjacent bits always differ, so the XOR produces all 1s. Verify the result is all 1s by checking xor & (xor + 1) === 0, which is true only for numbers of the form 2^k - 1.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'XOR Pattern',
    whyItWorks: 'Alternating bits like 101 shifted right gives 010, and XOR of these is 111 (all ones). A non-alternating pattern produces at least one 0 in the XOR result.',
  },
  {
    id: 'hamming-distance',
    name: 'Hamming Distance',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Count differing bit positions between two numbers',
    code: `// Hamming Distance
// XOR gives 1s where bits differ
// Count the 1s in XOR result

function hammingDistance(x, y) {
  console.log("x =", x, "y =", y);

  let xor = x ^ y;
  console.log("x XOR y =", xor);

  let distance = 0;
  while (xor !== 0) {
    xor = xor & (xor - 1);
    distance = distance + 1;
  }

  return distance;
}

console.log("=== Test: 1 vs 4 ===");
let d1 = hammingDistance(1, 4);
console.log("Distance:", d1);
console.log("(001 vs 100 = 2 bits)");

console.log("\\n=== Test: 3 vs 1 ===");
let d2 = hammingDistance(3, 1);
console.log("Distance:", d2);
console.log("(11 vs 01 = 1 bit)");
`,
    approach: 'XOR the two numbers to get a value with 1s at every bit position where they differ. Count the set bits in the XOR result using Brian Kernighan\'s algorithm (n & (n - 1) to clear the lowest set bit each iteration).',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'XOR Pattern',
    whyItWorks: 'XOR produces 1 exactly where bits differ, so counting 1s in the XOR result directly gives the number of differing positions (Hamming distance).',
  },
  {
    id: 'maximum-xor',
    name: 'Maximum XOR',
    category: 'bit-manipulation',
    difficulty: 'hard',
    description: 'Find maximum XOR of any two numbers in array',
    code: `// Maximum XOR of Two Numbers
// Compare all pairs (optimal uses Trie)

function findMaximumXOR(nums) {
  if (nums.length < 2) return 0;

  let maxXor = 0;
  console.log("Finding max XOR pairs...\\n");

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      let xor = nums[i] ^ nums[j];
      if (xor > maxXor) {
        console.log(nums[i], "^", nums[j], "=", xor, "(new max!)");
        maxXor = xor;
      }
    }
  }

  return maxXor;
}

let nums = [3, 10, 5, 25, 2, 8];
console.log("Array:", nums);
console.log("");
let maxXor = findMaximumXOR(nums);
console.log("\\nMaximum XOR:", maxXor);
`,
    approach: 'Compare all pairs of numbers by computing their XOR and tracking the maximum. For each pair (i, j), XOR gives the combined differing bits, and the largest XOR value represents the pair with the most significant differing bits.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    patternName: 'XOR Pattern',
    whyItWorks: 'XOR of two numbers produces the largest value when they differ at the highest bit positions, so exhaustive comparison finds the optimal pair.',
  },
  {
    id: 'gray-code',
    name: 'Gray Code',
    category: 'bit-manipulation',
    difficulty: 'medium',
    description: 'Generate Gray code sequence where adjacent values differ by one bit',
    code: `// Gray Code
// Formula: gray(i) = i ^ (i >> 1)

function grayCode(n) {
  const result = []
  const total = 1 << n

  for (let i = 0; i < total; i++) {
    const gray = i ^ (i >> 1)
    console.log('i =', i, 'gray =', gray)
    result.push(gray)
  }

  return result
}

const n = 3
console.log('Gray code for n =', n)
console.log(grayCode(n))
`,
    approach: 'Generate 2^n Gray codes using the formula gray(i) = i ^ (i >> 1). Iterate from 0 to 2^n - 1 and apply the formula to each index. Adjacent values in the sequence differ by exactly one bit.',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(2^n)',
    patternName: 'Bit Shifting',
    whyItWorks: 'XOR-ing a number with its right-shifted self flips at most one bit between consecutive integers, which is exactly the Gray code property.',
  },
  {
    id: 'subsets',
    name: 'Subsets',
    category: 'bit-manipulation',
    difficulty: 'medium',
    description: 'Generate all subsets using a bitmask from 0..(2^n - 1)',
    code: `// Subsets using bitmask enumeration

function subsets(nums) {
  const result = []
  const total = 1 << nums.length

  for (let mask = 0; mask < total; mask++) {
    const subset = []
    for (let i = 0; i < nums.length; i++) {
      if (mask & (1 << i)) {
        subset.push(nums[i])
      }
    }
    console.log(mask.toString(2).padStart(nums.length, '0'), '->', subset)
    result.push(subset)
  }

  return result
}

const nums = [1, 2, 3]
subsets(nums)
`,
    approach: 'Enumerate all 2^n bitmasks from 0 to 2^n - 1. For each mask, include element i in the subset whenever bit i is set (mask & (1 << i)). Each mask uniquely represents one subset of the input array.',
    timeComplexity: 'O(n * 2^n)',
    spaceComplexity: 'O(n * 2^n)',
    patternName: 'Bitmask Enumeration',
    whyItWorks: 'There is a one-to-one correspondence between n-bit binary numbers and subsets of an n-element set, so iterating all masks generates every possible subset exactly once.',
  },
  {
    id: 'sort-integers-by-1-bits',
    name: 'Sort Integers by 1 Bits',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Sort by popcount (number of 1 bits), then by value',
    code: `// Sort Integers by 1 Bits
// popcount: count of set bits

function popcount(n) {
  let count = 0
  let value = n

  while (value > 0) {
    value = value & (value - 1)
    count = count + 1
  }

  return count
}

function sortByBits(arr) {
  return arr.slice().sort((a, b) => {
    const countA = popcount(a)
    const countB = popcount(b)
    if (countA === countB) return a - b
    return countA - countB
  })
}

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
console.log(sortByBits(arr))
`,
    approach: 'Compute the popcount (number of set bits) for each integer using Brian Kernighan\'s algorithm. Sort the array with a custom comparator that orders by ascending popcount first, then by ascending numeric value for ties.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    patternName: 'Bit Counting',
    whyItWorks: 'The comparator encodes a two-level sort key: primary key is the number of 1-bits, secondary key is the integer value itself, producing a stable ordering by bit density.',
  },
  {
    id: 'minimum-bit-flips',
    name: 'Minimum Bit Flips',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Find how many bits differ between start and goal',
    code: `// Minimum Bit Flips to Convert Number
// XOR highlights different bits, then count 1s

function minBitFlips(start, goal) {
  let xor = start ^ goal
  let flips = 0

  while (xor > 0) {
    xor = xor & (xor - 1)
    flips = flips + 1
  }

  return flips
}

const start = 10 // 1010
const goal = 7   // 0111
console.log('Flips:', minBitFlips(start, goal))
`,
    approach: 'XOR start and goal to highlight the bits that differ. Count the set bits in the XOR result using Brian Kernighan\'s algorithm. Each set bit represents one required flip.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'XOR Pattern',
    whyItWorks: 'XOR marks exactly the positions where the two numbers differ, and the count of those 1-bits equals the minimum number of single-bit flips needed to convert one number to the other.',
  },
  {
    id: 'minimum-flips-a-or-b',
    name: 'Minimum Flips A OR B',
    category: 'bit-manipulation',
    difficulty: 'medium',
    description: 'Minimum flips to make (a | b) equal to c',
    code: `// Minimum Flips to Make a OR b Equal to c

function minFlips(a, b, c) {
  let flips = 0

  while (a > 0 || b > 0 || c > 0) {
    const bitA = a & 1
    const bitB = b & 1
    const bitC = c & 1

    if (bitC === 0) {
      flips = flips + bitA + bitB
    } else {
      if ((bitA | bitB) === 0) {
        flips = flips + 1
      }
    }

    a = a >> 1
    b = b >> 1
    c = c >> 1
  }

  return flips
}

console.log('Flips:', minFlips(2, 6, 5)) // 2
`,
    approach: 'Process each bit position of a, b, and c from least significant to most significant. If c\'s bit is 0, both a and b bits must be 0, so count flips for any 1s. If c\'s bit is 1, at least one of a or b must be 1, so add a flip only if both are 0.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    patternName: 'Bit Manipulation',
    whyItWorks: 'Analyzing each bit independently reduces the problem to per-bit logic: a target 0-bit requires clearing both inputs (up to 2 flips), while a target 1-bit requires at most one flip if neither input contributes.',
  },

  // ==================== TWO POINTERS ====================
  {
    id: 'two-sum-ii',
    name: 'Two Sum II (Sorted)',
    category: 'two-pointers',
    categories: ['two-pointers', 'arrays-hashing', 'binary-search'],
    difficulty: 'easy',
    description: 'Find two numbers in a sorted array that add up to target',
    code: `// Two Sum II - Sorted Array
// Use two pointers: if sum < target, move left up
// If sum > target, move right down

function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  console.log("Finding two numbers that sum to", target);
  console.log("Array:", nums);
  console.log("");

  while (left < right) {
    let sum = nums[left] + nums[right];
    console.log("left:", left, "right:", right);
    console.log(nums[left], "+", nums[right], "=", sum);

    if (sum === target) {
      console.log("Found! Indices:", left, right);
      return [left, right];
    } else if (sum < target) {
      console.log("Sum too small, move left pointer right");
      left++;
    } else {
      console.log("Sum too big, move right pointer left");
      right--;
    }
    console.log("");
  }

  return [];
}

let nums = [2, 7, 11, 15];
let target = 9;
let result = twoSum(nums, target);
console.log("Result:", result);
`,
    approach: 'Place one pointer at the start and one at the end of the sorted array. If the sum is too small, advance the left pointer to increase it. If too large, retreat the right pointer to decrease it. This converges on the target pair in one pass.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging)',
    whyItWorks: 'Sorted order guarantees that moving the left pointer right increases the sum and moving the right pointer left decreases it, so each step provably eliminates at least one candidate pair.',
  },
  {
    id: 'valid-palindrome',
    name: 'Valid Palindrome',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Check if string is palindrome (ignoring non-alphanumeric)',
    code: `// Valid Palindrome
// Compare characters from both ends moving inward

function isPalindrome(s) {
  // Clean string: lowercase, alphanumeric only
  let clean = "";
  for (let i = 0; i < s.length; i++) {
    let c = s.charAt(i).toLowerCase();
    if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
      clean = clean + c;
    }
  }

  console.log("Original:", s);
  console.log("Cleaned:", clean);
  console.log("");

  let left = 0;
  let right = clean.length - 1;

  while (left < right) {
    console.log("left:", left, "right:", right);
    console.log("Comparing:", clean.charAt(left), "vs", clean.charAt(right));

    if (clean.charAt(left) !== clean.charAt(right)) {
      console.log("Mismatch! Not a palindrome");
      return false;
    }

    console.log("Match!");
    left++;
    right--;
    console.log("");
  }

  console.log("All characters matched - it's a palindrome!");
  return true;
}

let s = "A man, a plan, a canal: Panama";
console.log("Is palindrome:", isPalindrome(s));
`,
    approach: 'First clean the string by filtering to only lowercase alphanumeric characters. Then use two converging pointers from both ends, comparing characters inward. Return false on the first mismatch or true if all pairs match.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Two Pointers (Converging)',
    whyItWorks: 'A palindrome reads the same forwards and backwards, so comparing symmetric positions from the outside in detects any asymmetry in at most n/2 comparisons.',
  },
  {
    id: 'reverse-string',
    name: 'Reverse String',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Reverse array of characters in-place using two pointers',
    code: `// Reverse String In-Place
// Swap characters from both ends moving inward

function reverseString(s) {
  console.log("Original:", s);
  console.log("");

  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    console.log("left:", left, "right:", right);
    console.log("Swapping", s[left], "and", s[right]);

    // Swap
    let temp = s[left];
    s[left] = s[right];
    s[right] = temp;

    console.log("After swap:", s);
    console.log("");

    left++;
    right--;
  }

  console.log("Reversed:", s);
  return s;
}

let chars = ["h", "e", "l", "l", "o"];
reverseString(chars);
`,
    approach: 'Use two pointers starting at the beginning and end of the array. Swap the characters at both pointers, then move them inward until they meet. This reverses the array in-place without extra space.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging)',
    whyItWorks: 'Swapping from both ends ensures every character reaches its mirror position in exactly n/2 swaps.',
  },
  {
    id: 'remove-duplicates-sorted',
    name: 'Remove Duplicates (Sorted)',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Remove duplicates from sorted array in-place, return new length',
    code: `// Remove Duplicates from Sorted Array
// Use slow pointer for unique elements position
// Fast pointer scans through array

function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  console.log("Original:", nums);
  console.log("");

  let slow = 0; // Position to place next unique

  for (let fast = 1; fast < nums.length; fast++) {
    console.log("slow:", slow, "fast:", fast);
    console.log("nums[slow]:", nums[slow], "nums[fast]:", nums[fast]);

    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
      console.log("Found new unique! Moved to position", slow);
      console.log("Array now:", nums);
    } else {
      console.log("Duplicate, skip");
    }
    console.log("");
  }

  let newLength = slow + 1;
  console.log("New length:", newLength);
  console.log("Unique elements:", nums.slice(0, newLength));
  return newLength;
}

let nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
removeDuplicates(nums);
`,
    approach: 'Use a slow pointer to track the position for the next unique element and a fast pointer to scan through the array. When the fast pointer finds a value different from nums[slow], increment slow and copy the new value there.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Same Direction)',
    whyItWorks: 'In a sorted array, duplicates are adjacent. The slow pointer only advances when a new unique value is found, naturally compacting unique elements to the front.',
  },
  {
    id: 'move-zeroes',
    name: 'Move Zeroes',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Move all zeroes to end while maintaining order of non-zero elements',
    code: `// Move Zeroes to End
// Slow pointer tracks position for non-zero
// Fast pointer finds non-zero elements

function moveZeroes(nums) {
  console.log("Original:", nums);
  console.log("");

  let slow = 0; // Position to place next non-zero

  for (let fast = 0; fast < nums.length; fast++) {
    console.log("slow:", slow, "fast:", fast);
    console.log("nums[fast]:", nums[fast]);

    if (nums[fast] !== 0) {
      // Swap non-zero to slow position
      let temp = nums[slow];
      nums[slow] = nums[fast];
      nums[fast] = temp;
      console.log("Non-zero found! Swapped to position", slow);
      console.log("Array:", nums);
      slow++;
    } else {
      console.log("Zero, skip");
    }
    console.log("");
  }

  console.log("Final:", nums);
  return nums;
}

let nums = [0, 1, 0, 3, 12];
moveZeroes(nums);
`,
    approach: 'Use a slow pointer to track where the next non-zero element should go. The fast pointer scans the array and whenever it finds a non-zero element, swap it with the element at the slow pointer position. This partitions the array into non-zeroes followed by zeroes.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Same Direction)',
    whyItWorks: 'Swapping non-zero elements to the slow pointer position preserves their relative order while naturally pushing zeroes to the end.',
  },
  {
    id: 'squares-sorted-array',
    name: 'Squares of Sorted Array',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Return squares of sorted array in sorted order (handles negatives)',
    code: `// Squares of a Sorted Array
// Two pointers from both ends (largest squares at edges)
// Fill result array from the end

function sortedSquares(nums) {
  console.log("Input:", nums);
  console.log("");

  let n = nums.length;
  let result = [];
  for (let i = 0; i < n; i++) result.push(0);

  let left = 0;
  let right = n - 1;
  let pos = n - 1; // Fill from end

  while (left <= right) {
    let leftSq = nums[left] * nums[left];
    let rightSq = nums[right] * nums[right];

    console.log("left:", left, "right:", right);
    console.log(nums[left], "^2 =", leftSq, ",", nums[right], "^2 =", rightSq);

    if (leftSq > rightSq) {
      result[pos] = leftSq;
      console.log("Left square larger, place", leftSq, "at position", pos);
      left++;
    } else {
      result[pos] = rightSq;
      console.log("Right square larger/equal, place", rightSq, "at position", pos);
      right--;
    }

    console.log("Result so far:", result);
    console.log("");
    pos--;
  }

  console.log("Final:", result);
  return result;
}

let nums = [-4, -1, 0, 3, 10];
sortedSquares(nums);
`,
    approach: 'Use two pointers at both ends of the sorted array. Compare the absolute values (squares) at each pointer, place the larger square at the end of the result array, and move that pointer inward. Fill the result from right to left.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Two Pointers (Converging)',
    whyItWorks: 'In a sorted array with negatives, the largest squares are at the extremes. By comparing from both ends and filling the result backwards, we produce a sorted output in one pass.',
  },
  {
    id: 'container-with-most-water',
    name: 'Container With Most Water',
    category: 'two-pointers',
    categories: ['two-pointers', 'arrays-hashing'],
    difficulty: 'medium',
    description: 'Find two lines that form container holding most water',
    code: `// Container With Most Water
// Area = min(height[l], height[r]) * (r - l)
// Move the shorter line inward to potentially find larger area

function maxArea(height) {
  console.log("Heights:", height);
  console.log("");

  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    let h = height[left] < height[right] ? height[left] : height[right];
    let width = right - left;
    let area = h * width;

    console.log("left:", left, "right:", right);
    console.log("Heights:", height[left], "and", height[right]);
    console.log("Area = min(" + height[left] + "," + height[right] + ") *", width, "=", area);

    if (area > maxWater) {
      maxWater = area;
      console.log("New max water:", maxWater);
    }

    // Move shorter side inward
    if (height[left] < height[right]) {
      console.log("Left shorter, move left");
      left++;
    } else {
      console.log("Right shorter/equal, move right");
      right--;
    }
    console.log("");
  }

  console.log("Maximum water:", maxWater);
  return maxWater;
}

let height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
maxArea(height);
`,
    approach: 'Start with two pointers at the widest possible container. Calculate the area using the shorter line as height. Move the pointer at the shorter line inward, since moving the taller line can only decrease width without increasing the limiting height.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging)',
    whyItWorks: 'The area is limited by the shorter line. Moving the shorter pointer inward is the only way to potentially find a taller line that could increase area, since decreasing width with the same height always reduces area.',
  },
  {
    id: 'three-sum',
    name: '3Sum',
    category: 'two-pointers',
    categories: ['two-pointers', 'arrays-hashing', 'sorting'],
    difficulty: 'medium',
    description: 'Find all unique triplets that sum to zero',
    code: `// 3Sum - Find triplets summing to zero
// Sort array, fix one element, use two pointers for other two
// Skip duplicates to avoid duplicate triplets

function threeSum(nums) {
  // Simple bubble sort for visualization
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length - 1; j++) {
      if (nums[j] > nums[j + 1]) {
        let temp = nums[j];
        nums[j] = nums[j + 1];
        nums[j + 1] = temp;
      }
    }
  }

  console.log("Sorted:", nums);
  console.log("");

  let result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicates for first element
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    console.log("Fixed i:", i, "value:", nums[i]);

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right];
      console.log("  left:", left, "right:", right);
      console.log(" ", nums[i], "+", nums[left], "+", nums[right], "=", sum);

      if (sum === 0) {
        console.log("  Found triplet!");
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        // Skip duplicates
        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
    console.log("");
  }

  console.log("Triplets found:", result.length);
  return result;
}

let nums = [-1, 0, 1, 2, -1, -4];
threeSum(nums);
`,
    approach: 'Sort the array first. Fix one element with an outer loop, then use two converging pointers on the remaining subarray to find pairs that sum to the negation of the fixed element. Skip duplicate values at each level to ensure unique triplets.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging) + Sort',
    whyItWorks: 'Sorting enables the two-pointer technique: if the current sum is too small, move the left pointer right to increase it; if too large, move right pointer left. Skipping duplicates prevents repeated triplets.',
  },
  {
    id: 'sort-colors',
    name: 'Sort Colors (Dutch Flag)',
    category: 'two-pointers',
    difficulty: 'medium',
    description: 'Sort array of 0s, 1s, 2s in-place using three pointers',
    code: `// Sort Colors - Dutch National Flag
// Three pointers: low (0s), mid (current), high (2s)
// 0s go to left, 2s go to right, 1s stay in middle

function sortColors(nums) {
  console.log("Original:", nums);
  console.log("0=red, 1=white, 2=blue");
  console.log("");

  let low = 0;   // Boundary for 0s
  let mid = 0;   // Current element
  let high = nums.length - 1; // Boundary for 2s

  while (mid <= high) {
    console.log("low:", low, "mid:", mid, "high:", high);
    console.log("Current element:", nums[mid]);

    if (nums[mid] === 0) {
      // Swap with low, both advance
      let temp = nums[low];
      nums[low] = nums[mid];
      nums[mid] = temp;
      console.log("Found 0, swap to low position");
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      // 1 is in correct position
      console.log("Found 1, already in place");
      mid++;
    } else {
      // Swap with high, only high decreases
      let temp = nums[high];
      nums[high] = nums[mid];
      nums[mid] = temp;
      console.log("Found 2, swap to high position");
      high--;
    }

    console.log("Array:", nums);
    console.log("");
  }

  console.log("Sorted:", nums);
  return nums;
}

let nums = [2, 0, 2, 1, 1, 0];
sortColors(nums);
`,
    approach: 'Use three pointers: low tracks the boundary for 0s, high tracks the boundary for 2s, and mid scans through. When mid finds a 0, swap with low and advance both. When mid finds a 2, swap with high and only decrement high. When mid finds a 1, just advance mid.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Dutch National Flag',
    whyItWorks: 'The three pointers partition the array into four regions: 0s (before low), 1s (low to mid), unprocessed (mid to high), and 2s (after high). Each swap places an element in its correct region.',
  },
  {
    id: 'remove-element',
    name: 'Remove Element',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Remove all instances of value in-place, return new length',
    code: `// Remove Element In-Place
// Slow pointer for valid elements
// Fast pointer scans all elements

function removeElement(nums, val) {
  console.log("Array:", nums);
  console.log("Remove value:", val);
  console.log("");

  let slow = 0;

  for (let fast = 0; fast < nums.length; fast++) {
    console.log("slow:", slow, "fast:", fast);
    console.log("nums[fast]:", nums[fast]);

    if (nums[fast] !== val) {
      nums[slow] = nums[fast];
      console.log("Keep element, copy to position", slow);
      slow++;
    } else {
      console.log("Skip, it's the target value");
    }
    console.log("Array:", nums);
    console.log("");
  }

  console.log("New length:", slow);
  console.log("Valid elements:", nums.slice(0, slow));
  return slow;
}

let nums = [3, 2, 2, 3];
let val = 3;
removeElement(nums, val);
`,
    approach: 'Use a slow pointer to track the write position for kept elements. The fast pointer scans every element. When the fast pointer finds a value that is not the target, copy it to the slow position and advance slow.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Same Direction)',
    whyItWorks: 'The slow pointer only advances for non-target elements, effectively overwriting target values and compacting the remaining elements in-place.',
  },
  {
    id: 'is-subsequence',
    name: 'Is Subsequence',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Check if s is a subsequence of t',
    code: `// Is Subsequence
// Two pointers: one for s, one for t
// Move s pointer only when characters match

function isSubsequence(s, t) {
  console.log("s:", s);
  console.log("t:", t);
  console.log("Check if s is subsequence of t");
  console.log("");

  let i = 0; // Pointer for s
  let j = 0; // Pointer for t

  while (i < s.length && j < t.length) {
    console.log("i:", i, "j:", j);
    console.log("s[i]:", s.charAt(i), "t[j]:", t.charAt(j));

    if (s.charAt(i) === t.charAt(j)) {
      console.log("Match! Advance both pointers");
      i++;
    } else {
      console.log("No match, advance j only");
    }
    j++;
    console.log("");
  }

  let result = i === s.length;
  console.log("Matched", i, "of", s.length, "characters");
  console.log("Is subsequence:", result);
  return result;
}

let s = "abc";
let t = "ahbgdc";
isSubsequence(s, t);
`,
    approach: 'Use two pointers, one for each string. Advance the pointer for t on every iteration. Only advance the pointer for s when the characters match. If all characters in s are matched by the end, s is a subsequence of t.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Same Direction)',
    whyItWorks: 'A subsequence preserves order but not contiguity. By greedily matching each character of s to the earliest possible position in t, we determine if the ordering can be preserved.',
  },
  {
    id: 'merge-sorted-array',
    name: 'Merge Sorted Array',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Merge two sorted arrays into first array in-place',
    code: `// Merge Sorted Array In-Place
// Start from the end to avoid overwriting
// Three pointers: end of nums1 elements, end of nums2, insert position

function merge(nums1, m, nums2, n) {
  console.log("nums1:", nums1, "(first", m, "are valid)");
  console.log("nums2:", nums2);
  console.log("");

  let p1 = m - 1;     // End of nums1 elements
  let p2 = n - 1;     // End of nums2
  let pos = m + n - 1; // Insert position

  while (p2 >= 0) {
    console.log("p1:", p1, "p2:", p2, "pos:", pos);

    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      console.log(nums1[p1], ">", nums2[p2], "- take from nums1");
      nums1[pos] = nums1[p1];
      p1--;
    } else {
      console.log(p1 < 0 ? "nums1 exhausted" : nums2[p2] + " >= " + nums1[p1], "- take from nums2");
      nums1[pos] = nums2[p2];
      p2--;
    }

    console.log("nums1:", nums1);
    console.log("");
    pos--;
  }

  console.log("Merged:", nums1);
  return nums1;
}

let nums1 = [1, 2, 3, 0, 0, 0];
let m = 3;
let nums2 = [2, 5, 6];
let n = 3;
merge(nums1, m, nums2, n);
`,
    approach: 'Merge from the end to avoid overwriting elements in nums1. Use three pointers: one at the end of valid elements in nums1, one at the end of nums2, and one at the last position of nums1. Place the larger element at the insert position and decrement the corresponding pointer.',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging from End)',
    whyItWorks: 'Starting from the back ensures we never overwrite unprocessed nums1 elements, since the merged position is always at or beyond the current nums1 read position.',
  },
  {
    id: 'partition-labels',
    name: 'Partition Labels',
    category: 'two-pointers',
    difficulty: 'medium',
    description: 'Partition string so each letter appears in at most one part',
    code: `// Partition Labels
// Find last occurrence of each character
// Extend partition end until all chars within are fully contained

function partitionLabels(s) {
  console.log("String:", s);
  console.log("");

  // Find last index of each character
  let lastIndex = {};
  for (let i = 0; i < s.length; i++) {
    lastIndex[s.charAt(i)] = i;
  }
  console.log("Last occurrence of each char:", lastIndex);
  console.log("");

  let result = [];
  let start = 0;
  let end = 0;

  for (let i = 0; i < s.length; i++) {
    let char = s.charAt(i);
    let charLast = lastIndex[char];

    console.log("i:", i, "char:", char, "lastIndex:", charLast);

    if (charLast > end) {
      end = charLast;
      console.log("Extend partition end to", end);
    }

    if (i === end) {
      let partSize = end - start + 1;
      result.push(partSize);
      console.log("Partition complete! Size:", partSize);
      console.log("Partition:", s.substring(start, end + 1));
      start = i + 1;
      console.log("");
    }
  }

  console.log("Partition sizes:", result);
  return result;
}

let s = "ababcbacadefegdehijhklij";
partitionLabels(s);
`,
    approach: 'First, record the last occurrence index of each character. Then scan left to right, extending the current partition end to the maximum last-occurrence of any character seen so far. When the current index equals the partition end, the partition is complete.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Greedy + Hash Map Lookup',
    whyItWorks: 'A partition is valid when every character within it has its final occurrence inside that partition. Tracking the farthest last-occurrence ensures no character spans two partitions.',
  },
  {
    id: 'trapping-rain-water',
    name: 'Trapping Rain Water',
    category: 'two-pointers',
    categories: ['two-pointers', 'arrays-hashing', 'stack', 'dynamic-programming'],
    difficulty: 'hard',
    description: 'Calculate how much rain water can be trapped between bars',
    code: `// Trapping Rain Water
// Water at position = min(maxLeft, maxRight) - height
// Two pointers track max height from each side

function trap(height) {
  console.log("Heights:", height);
  console.log("");

  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    console.log("left:", left, "right:", right);
    console.log("leftMax:", leftMax, "rightMax:", rightMax);

    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
        console.log("New leftMax:", leftMax);
      } else {
        let trapped = leftMax - height[left];
        water = water + trapped;
        console.log("Trap", trapped, "units at position", left);
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
        console.log("New rightMax:", rightMax);
      } else {
        let trapped = rightMax - height[right];
        water = water + trapped;
        console.log("Trap", trapped, "units at position", right);
      }
      right--;
    }

    console.log("Total water so far:", water);
    console.log("");
  }

  console.log("Total trapped water:", water);
  return water;
}

let height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
trap(height);
`,
    approach: 'Use two pointers from both ends, tracking the maximum height seen from each side. Process the pointer with the smaller max height: if the current bar is shorter than its side max, the difference is trapped water. Otherwise, update the side max. Move the processed pointer inward.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging)',
    whyItWorks: 'Water at any position is determined by min(leftMax, rightMax) - height. By always processing the side with the smaller max, we know the other side has a taller or equal wall, so the water level is determined solely by the current side max.',
  },
  {
    id: 'three-sum-closest',
    name: '3Sum Closest',
    category: 'two-pointers',
    difficulty: 'medium',
    description: 'Find three integers whose sum is closest to target',
    code: `// 3Sum Closest
// Similar to 3Sum but track closest sum to target

function threeSumClosest(nums, target) {
  // Simple sort
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length - 1; j++) {
      if (nums[j] > nums[j + 1]) {
        let temp = nums[j];
        nums[j] = nums[j + 1];
        nums[j + 1] = temp;
      }
    }
  }

  console.log("Sorted:", nums);
  console.log("Target:", target);
  console.log("");

  let closest = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < nums.length - 2; i++) {
    console.log("Fixed i:", i, "value:", nums[i]);

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right];
      console.log("  left:", left, "right:", right);
      console.log(" ", nums[i], "+", nums[left], "+", nums[right], "=", sum);

      let currDiff = sum > target ? sum - target : target - sum;
      let closestDiff = closest > target ? closest - target : target - closest;

      if (currDiff < closestDiff) {
        closest = sum;
        console.log("  New closest:", closest, "(diff:", currDiff + ")");
      }

      if (sum === target) {
        console.log("  Exact match!");
        return sum;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
    console.log("");
  }

  console.log("Closest sum:", closest);
  return closest;
}

let nums = [-1, 2, 1, -4];
let target = 1;
threeSumClosest(nums, target);
`,
    approach: 'Sort the array, then fix one element with an outer loop and use two converging pointers for the remaining pair. Track the sum closest to the target by comparing absolute differences. Adjust pointers based on whether the current sum is less than or greater than the target.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging) + Sort',
    whyItWorks: 'Sorting allows the two-pointer approach to systematically explore sums: moving left increases the sum, moving right decreases it, efficiently narrowing in on the closest possible sum.',
  },
  {
    id: 'valid-palindrome-ii',
    name: 'Valid Palindrome II',
    category: 'two-pointers',
    categories: ['two-pointers', 'strings'],
    difficulty: 'easy',
    description: 'Check if string can be a palindrome by removing at most one character',
    code: `// Valid Palindrome II
// Two pointers converge from edges
// On mismatch, try skipping left or right char
// If either remaining substring is palindrome, return true

function isPalin(s, l, r) {
  while (l < r) {
    if (s[l] !== s[r]) return false
    l++
    r--
  }
  return true
}

function validPalindrome(s) {
  console.log("String:", s)
  console.log("")

  var left = 0
  var right = s.length - 1

  while (left < right) {
    console.log("left:", left, "(" + s[left] + ") right:", right, "(" + s[right] + ")")

    if (s[left] !== s[right]) {
      console.log("  Mismatch! Try skipping left or right")

      var skipLeft = isPalin(s, left + 1, right)
      console.log("  Skip left (" + s[left] + "):", skipLeft)

      var skipRight = isPalin(s, left, right - 1)
      console.log("  Skip right (" + s[right] + "):", skipRight)

      var result = skipLeft || skipRight
      console.log("  Can be palindrome:", result)
      return result
    }

    console.log("  Match!")
    left++
    right--
  }

  console.log("")
  console.log("Already a palindrome, no removal needed")
  return true
}

validPalindrome("abca")
`,
    approach: 'Use converging two pointers from both ends. When a mismatch is found, try two options: skip the left character or skip the right character. Check if either remaining substring forms a palindrome. If so, the original string is a palindrome with one deletion.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging)',
    whyItWorks: 'A mismatch gives exactly two recovery options. Only one character can be removed, so trying both skip-left and skip-right covers all possibilities without backtracking.',
  },
  {
    id: 'boats-to-save-people',
    name: 'Boats to Save People',
    category: 'two-pointers',
    categories: ['two-pointers', 'greedy', 'sorting'],
    difficulty: 'medium',
    description: 'Minimum boats to carry people with weight limit',
    code: `// Boats to Save People
// Sort people by weight
// Pair lightest with heaviest if they fit
// Otherwise heaviest goes alone

function numRescueBoats(people, limit) {
  console.log("People:", people, "Limit:", limit)

  // Bubble sort
  for (var i = 0; i < people.length; i++) {
    for (var j = 0; j < people.length - 1 - i; j++) {
      if (people[j] > people[j + 1]) {
        var temp = people[j]
        people[j] = people[j + 1]
        people[j + 1] = temp
      }
    }
  }
  console.log("Sorted:", people)
  console.log("")

  var left = 0
  var right = people.length - 1
  var boats = 0

  while (left <= right) {
    console.log("left:", left, "(" + people[left] + ") right:", right, "(" + people[right] + ")")
    var sum = people[left] + people[right]

    if (left === right) {
      console.log("  One person left, needs own boat")
      boats++
      break
    }

    if (sum <= limit) {
      console.log("  Pair fits! " + people[left] + " + " + people[right] + " = " + sum + " <= " + limit)
      left++
      right--
    } else {
      console.log("  Too heavy! " + people[right] + " goes alone")
      right--
    }
    boats++
    console.log("  Boats used so far:", boats)
    console.log("")
  }

  console.log("Total boats needed:", boats)
  return boats
}

numRescueBoats([3, 2, 2, 1], 3)
`,
    approach: 'Sort people by weight. Use two pointers: pair the lightest person with the heaviest. If they fit together within the limit, both board one boat and both pointers move inward. Otherwise, the heaviest person takes a boat alone and only the right pointer moves.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging) + Greedy',
    whyItWorks: 'Greedy pairing of lightest with heaviest maximizes space utilization. If the lightest cannot pair with the heaviest, no one else can pair with that heavy person either.',
  },
  {
    id: 'rotate-array',
    name: 'Rotate Array',
    category: 'two-pointers',
    categories: ['two-pointers', 'arrays-hashing'],
    difficulty: 'medium',
    description: 'Rotate array to the right by k steps using triple reverse',
    code: `// Rotate Array - Triple Reverse
// Reverse entire array, then first k, then rest
// Uses two pointers in reverse helper

function reverse(arr, l, r) {
  while (l < r) {
    var temp = arr[l]
    arr[l] = arr[r]
    arr[r] = temp
    l++
    r--
  }
}

function rotate(nums, k) {
  console.log("Array:", nums)
  console.log("Rotate by:", k)
  console.log("")

  k = k % nums.length
  if (k === 0) {
    console.log("No rotation needed")
    return
  }

  console.log("Effective k:", k)
  console.log("")

  // Step 1: Reverse all
  console.log("Step 1: Reverse entire array")
  reverse(nums, 0, nums.length - 1)
  console.log("  Result:", nums)
  console.log("")

  // Step 2: Reverse first k
  console.log("Step 2: Reverse first", k, "elements")
  reverse(nums, 0, k - 1)
  console.log("  Result:", nums)
  console.log("")

  // Step 3: Reverse remaining
  console.log("Step 3: Reverse elements from index", k, "to", nums.length - 1)
  reverse(nums, k, nums.length - 1)
  console.log("  Result:", nums)
  console.log("")

  console.log("Final rotated array:", nums)
}

rotate([1, 2, 3, 4, 5, 6, 7], 3)
`,
    approach: 'Use the triple-reverse technique: first reverse the entire array, then reverse the first k elements, then reverse the remaining elements. Each reverse uses two converging pointers. Normalize k by taking k mod n to handle cases where k exceeds array length.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Triple Reverse)',
    whyItWorks: 'Reversing the whole array puts elements in the right relative order but backwards. The two subsequent partial reverses flip each segment back to the correct order, completing the rotation.',
  },
  {
    id: 'four-sum',
    name: '4Sum',
    category: 'two-pointers',
    categories: ['two-pointers', 'arrays-hashing', 'sorting'],
    difficulty: 'medium',
    description: 'Find all unique quadruplets that sum to target',
    code: `// 4Sum
// Fix two elements with nested loops
// Use two pointers for remaining pair
// Sort + skip duplicates for unique results

function fourSum(nums, target) {
  console.log("Array:", nums, "Target:", target)

  // Bubble sort
  for (var i = 0; i < nums.length; i++) {
    for (var j = 0; j < nums.length - 1 - i; j++) {
      if (nums[j] > nums[j + 1]) {
        var temp = nums[j]
        nums[j] = nums[j + 1]
        nums[j + 1] = temp
      }
    }
  }
  console.log("Sorted:", nums)
  console.log("")

  var result = []

  for (var a = 0; a < nums.length - 3; a++) {
    if (a > 0 && nums[a] === nums[a - 1]) continue

    for (var b = a + 1; b < nums.length - 2; b++) {
      if (b > a + 1 && nums[b] === nums[b - 1]) continue

      var left = b + 1
      var right = nums.length - 1

      while (left < right) {
        var sum = nums[a] + nums[b] + nums[left] + nums[right]
        console.log("a:", a, "b:", b, "left:", left, "right:", right,
          "values:", nums[a], nums[b], nums[left], nums[right], "sum:", sum)

        if (sum === target) {
          console.log("  Found quadruplet!", [nums[a], nums[b], nums[left], nums[right]])
          result.push([nums[a], nums[b], nums[left], nums[right]])
          while (left < right && nums[left] === nums[left + 1]) left++
          while (left < right && nums[right] === nums[right - 1]) right--
          left++
          right--
        } else if (sum < target) {
          left++
        } else {
          right--
        }
      }
    }
  }

  console.log("")
  console.log("All quadruplets:", result)
  return result
}

fourSum([-2, -1, 0, 1, 2], 0)
`,
    approach: 'Sort the array, then use two nested loops to fix the first two elements. For the remaining two, use converging two pointers. Skip duplicates at every level to ensure unique quadruplets. This reduces the problem from O(n^4) brute force to O(n^3).',
    timeComplexity: 'O(n^3)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Converging) + Sort',
    whyItWorks: 'Sorting enables efficient duplicate skipping and the two-pointer sum search. Each nesting level fixes one more element, and the innermost two-pointer scan finds all valid pairs in linear time.',
  },
  {
    id: 'long-pressed-name',
    name: 'Long Pressed Name',
    category: 'two-pointers',
    categories: ['two-pointers', 'strings'],
    difficulty: 'easy',
    description: 'Check if typed string could be result of long pressing name',
    code: `// Long Pressed Name
// If chars match, advance both pointers
// If typed matches previous typed char (long press), advance typed only
// Otherwise return false

function isLongPressedName(name, typed) {
  console.log("Name:", name)
  console.log("Typed:", typed)
  console.log("")

  var i = 0
  var j = 0

  while (j < typed.length) {
    console.log("i:", i, "j:", j,
      "name[i]:", i < name.length ? name[i] : "END",
      "typed[j]:", typed[j])

    if (i < name.length && name[i] === typed[j]) {
      console.log("  Match! Advance both")
      i++
      j++
    } else if (j > 0 && typed[j] === typed[j - 1]) {
      console.log("  Long press of '" + typed[j] + "', advance typed only")
      j++
    } else {
      console.log("  Mismatch! Not a long press result")
      return false
    }
  }

  var result = i === name.length
  console.log("")
  if (result) {
    console.log("All name characters matched:", result)
  } else {
    console.log("Not all name characters consumed, i:", i, "name.length:", name.length)
  }
  return result
}

isLongPressedName("alex", "aaleex")
`,
    approach: 'Use two pointers, one for the name and one for typed. If characters match, advance both. If the typed character matches the previous typed character, it is a long press, so advance only the typed pointer. Otherwise return false. Verify all name characters were consumed.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Same Direction)',
    whyItWorks: 'Long presses only repeat the previous character. By checking if unmatched typed characters are repeats of the prior character, we distinguish valid long presses from mistyped characters.',
  },
  {
    id: 'intersection-of-two-arrays-ii',
    name: 'Intersection of Two Arrays II',
    category: 'two-pointers',
    categories: ['two-pointers', 'arrays-hashing', 'sorting'],
    difficulty: 'easy',
    description: 'Find intersection of two arrays including duplicates',
    code: `// Intersection of Two Arrays II
// Sort both arrays
// Two pointers: equal values go to result
// Otherwise advance the pointer with smaller value

function intersect(nums1, nums2) {
  console.log("Array 1:", nums1)
  console.log("Array 2:", nums2)

  // Bubble sort nums1
  for (var i = 0; i < nums1.length; i++) {
    for (var j = 0; j < nums1.length - 1 - i; j++) {
      if (nums1[j] > nums1[j + 1]) {
        var temp = nums1[j]
        nums1[j] = nums1[j + 1]
        nums1[j + 1] = temp
      }
    }
  }

  // Bubble sort nums2
  for (var i = 0; i < nums2.length; i++) {
    for (var j = 0; j < nums2.length - 1 - i; j++) {
      if (nums2[j] > nums2[j + 1]) {
        var temp = nums2[j]
        nums2[j] = nums2[j + 1]
        nums2[j + 1] = temp
      }
    }
  }

  console.log("Sorted 1:", nums1)
  console.log("Sorted 2:", nums2)
  console.log("")

  var result = []
  var p1 = 0
  var p2 = 0

  while (p1 < nums1.length && p2 < nums2.length) {
    console.log("p1:", p1, "(" + nums1[p1] + ") p2:", p2, "(" + nums2[p2] + ")")

    if (nums1[p1] === nums2[p2]) {
      console.log("  Equal! Add", nums1[p1], "to result")
      result.push(nums1[p1])
      p1++
      p2++
    } else if (nums1[p1] < nums2[p2]) {
      console.log("  " + nums1[p1] + " < " + nums2[p2] + ", advance p1")
      p1++
    } else {
      console.log("  " + nums1[p1] + " > " + nums2[p2] + ", advance p2")
      p2++
    }
  }

  console.log("")
  console.log("Intersection:", result)
  return result
}

intersect([1, 2, 2, 1], [2, 2])
`,
    approach: 'Sort both arrays first. Use two pointers, one per array. When values are equal, add to the result and advance both. When they differ, advance the pointer at the smaller value to catch up. This naturally handles duplicate counts.',
    timeComplexity: 'O(n log n + m log m)',
    spaceComplexity: 'O(min(n, m))',
    patternName: 'Two Pointers (Same Direction) + Sort',
    whyItWorks: 'Sorting groups identical values together. The pointer with the smaller value advances to find a potential match, and matching consumes one occurrence from each array, correctly counting shared duplicates.',
  },
  {
    id: 'remove-duplicates-sorted-ii',
    name: 'Remove Duplicates from Sorted Array II',
    category: 'two-pointers',
    categories: ['two-pointers', 'arrays-hashing'],
    difficulty: 'medium',
    description: 'Remove duplicates allowing at most two of each element',
    code: `// Remove Duplicates from Sorted Array II
// Allow at most 2 of each element
// Compare nums[fast] with nums[slow - 2]
// If different, copy to slow position

function removeDuplicates(nums) {
  console.log("Array:", nums)
  console.log("")

  if (nums.length <= 2) {
    console.log("Length <= 2, no duplicates to remove")
    return nums.length
  }

  var slow = 2

  for (var fast = 2; fast < nums.length; fast++) {
    console.log("fast:", fast, "slow:", slow,
      "nums[fast]:", nums[fast], "nums[slow-2]:", nums[slow - 2])

    if (nums[fast] !== nums[slow - 2]) {
      console.log("  " + nums[fast] + " !== " + nums[slow - 2] + ", copy to position", slow)
      nums[slow] = nums[fast]
      slow++
    } else {
      console.log("  " + nums[fast] + " === " + nums[slow - 2] + ", skip (already have 2)")
    }
    console.log("  Array so far:", nums)
  }

  console.log("")
  console.log("Final length:", slow)
  console.log("Array:", nums.slice(0, slow))
  return slow
}

removeDuplicates([1, 1, 1, 2, 2, 3])
`,
    approach: 'Use a slow pointer starting at index 2. The fast pointer scans from index 2 onward. Compare nums[fast] with nums[slow - 2]: if they differ, the element is safe to keep (at most 2 copies), so copy it to slow and advance slow.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Same Direction)',
    whyItWorks: 'Comparing with nums[slow - 2] ensures at most two copies of any value survive. If nums[fast] equals nums[slow - 2], there are already two copies in the valid region, so it must be skipped.',
  },
  {
    id: 'backspace-string-compare',
    name: 'Backspace String Compare',
    category: 'two-pointers',
    categories: ['two-pointers', 'strings', 'stack'],
    difficulty: 'easy',
    description: 'Compare two strings with backspace characters (#)',
    code: `// Backspace String Compare
// Process from the end of both strings
// Count '#' as skips, find next valid char
// Compare valid chars from both strings

function getNextValid(str, idx) {
  var skip = 0
  while (idx >= 0) {
    if (str[idx] === "#") {
      skip++
      idx--
    } else if (skip > 0) {
      skip--
      idx--
    } else {
      break
    }
  }
  return idx
}

function backspaceCompare(s, t) {
  console.log("s:", s)
  console.log("t:", t)
  console.log("")

  var i = s.length - 1
  var j = t.length - 1

  while (i >= 0 || j >= 0) {
    i = getNextValid(s, i)
    j = getNextValid(t, j)

    var charS = i >= 0 ? s[i] : ""
    var charT = j >= 0 ? t[j] : ""

    console.log("i:", i, "char:", charS || "NONE", "| j:", j, "char:", charT || "NONE")

    if (charS !== charT) {
      console.log("  Mismatch! '" + charS + "' !== '" + charT + "'")
      console.log("  Result: false")
      return false
    }

    console.log("  Match: '" + charS + "'")
    i--
    j--
  }

  console.log("")
  console.log("All characters matched!")
  console.log("Result: true")
  return true
}

backspaceCompare("ab#c", "ad#c")
`,
    approach: 'Process both strings from the end. For each string, skip characters when encountering backspaces by counting consecutive # symbols. Compare the next valid characters from both strings. If they differ at any point, the strings are not equal.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Reverse Traversal)',
    whyItWorks: 'Processing from the end allows us to handle backspaces without extra space. Each # cancels the preceding character, and counting skips handles consecutive backspaces correctly.',
  },
  {
    id: 'string-compression',
    name: 'String Compression',
    category: 'two-pointers',
    categories: ['two-pointers', 'strings'],
    difficulty: 'medium',
    description: 'Compress string in-place using read/write pointers',
    code: `// String Compression
// Read pointer scans groups of consecutive same chars
// Write pointer writes char + count digits in-place
// Return new length

function compress(chars) {
  console.log("Input:", chars)
  console.log("")

  var write = 0
  var read = 0

  while (read < chars.length) {
    var currentChar = chars[read]
    var count = 0

    // Count consecutive same characters
    while (read < chars.length && chars[read] === currentChar) {
      read++
      count++
    }

    console.log("Group: '" + currentChar + "' x " + count)

    // Write the character
    chars[write] = currentChar
    write++

    // Write count digits if > 1
    if (count > 1) {
      var countStr = "" + count
      for (var d = 0; d < countStr.length; d++) {
        chars[write] = countStr[d]
        write++
      }
      console.log("  Write: '" + currentChar + "' + '" + countStr + "'")
    } else {
      console.log("  Write: '" + currentChar + "' (count 1, no digit)")
    }
    console.log("  Array so far:", chars, "write:", write)
    console.log("")
  }

  console.log("Compressed length:", write)
  console.log("Result:", chars.slice(0, write))
  return write
}

compress(["a", "a", "b", "b", "c", "c", "c"])
`,
    approach: 'Use a read pointer to scan groups of consecutive identical characters and a write pointer to overwrite the array in-place. For each group, write the character followed by its count digits (only if count exceeds 1). Return the write pointer as the new length.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Two Pointers (Read/Write)',
    whyItWorks: 'The write pointer never overtakes the read pointer because the compressed form is always shorter or equal. Writing char + count digits in-place is safe since we have already read past those positions.',
  },

  // ==================== SLIDING WINDOW ====================
  {
    id: 'max-sum-subarray-k',
    name: 'Maximum Sum Subarray of Size K',
    category: 'sliding-window',
    difficulty: 'easy',
    description: 'Find the maximum sum of any contiguous subarray of size k',
    code: `// Maximum Sum Subarray of Size K
// Fixed-size window: build first window, then slide

function maxSumSubarrayK(arr, k) {
  let windowSum = 0;
  let maxSum = 0;

  console.log("Array:", arr);
  console.log("Window size k:", k);
  console.log("");

  // Build the first window
  for (let i = 0; i < k; i++) {
    windowSum = windowSum + arr[i];
    console.log("Building window: added", arr[i], "=> sum =", windowSum);
  }
  maxSum = windowSum;
  console.log("Initial window sum:", windowSum);
  console.log("");

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    let removed = arr[i - k];
    let added = arr[i];
    windowSum = windowSum + added - removed;
    console.log("Slide: remove", removed, ", add", added, "=> sum =", windowSum);

    if (windowSum > maxSum) {
      maxSum = windowSum;
      console.log("  New max sum:", maxSum);
    }
  }

  console.log("");
  console.log("Result:", maxSum);
  return maxSum;
}

let result = maxSumSubarrayK([2, 1, 5, 1, 3, 2], 3);
console.log("Result:", result);
`,
    approach: 'Build the initial window by summing the first k elements. Then slide the window one position at a time: add the new right element and subtract the element that falls off the left. Track the maximum sum seen across all window positions.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Sliding Window (Fixed Size)',
    whyItWorks: 'Each window position differs from the previous by exactly one element added and one removed. By maintaining a running sum, we avoid recomputing the entire sum for each position, reducing the work from O(n*k) to O(n).',
  },
  {
    id: 'max-average-subarray',
    name: 'Maximum Average Subarray I',
    category: 'sliding-window',
    difficulty: 'easy',
    description: 'Find the contiguous subarray of size k with the maximum average',
    code: `// Maximum Average Subarray I
// Fixed-size window: track sum, divide by k at the end

function findMaxAverage(nums, k) {
  let windowSum = 0;
  let maxSum = 0;

  console.log("Array:", nums);
  console.log("Window size k:", k);
  console.log("");

  // Build the first window
  for (let i = 0; i < k; i++) {
    windowSum = windowSum + nums[i];
    console.log("Building window: added", nums[i], "=> sum =", windowSum);
  }
  maxSum = windowSum;
  console.log("Initial window sum:", windowSum);
  console.log("");

  // Slide the window
  for (let i = k; i < nums.length; i++) {
    let removed = nums[i - k];
    let added = nums[i];
    windowSum = windowSum + added - removed;
    console.log("Slide: remove", removed, ", add", added, "=> sum =", windowSum);

    if (windowSum > maxSum) {
      maxSum = windowSum;
      console.log("  New max sum:", maxSum);
    }
  }

  let maxAvg = maxSum / k;
  console.log("");
  console.log("Max sum:", maxSum, "/ k:", k, "= average:", maxAvg);
  console.log("Result:", maxAvg);
  return maxAvg;
}

let result = findMaxAverage([1, 12, -5, -6, 50, 3], 4);
console.log("Result:", result);
`,
    approach: 'Use the same fixed-size sliding window as Maximum Sum Subarray. Build the first window of k elements, then slide across, tracking the maximum sum. At the end, divide the maximum sum by k to get the maximum average.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Sliding Window (Fixed Size)',
    whyItWorks: 'Since k is constant, the subarray with the maximum sum also has the maximum average. We only need to divide once at the end rather than at each step, keeping the logic simple and efficient.',
  },
  {
    id: 'longest-substring-no-repeat',
    name: 'Longest Substring Without Repeating Characters',
    category: 'sliding-window',
    difficulty: 'medium',
    description: 'Find the length of the longest substring without repeating characters',
    code: `// Longest Substring Without Repeating Characters
// Variable window with Map tracking last seen index

function lengthOfLongestSubstring(s) {
  let charMap = new Map();
  let left = 0;
  let maxLen = 0;

  console.log("String:", s);
  console.log("");

  for (let right = 0; right < s.length; right++) {
    let ch = s.charAt(right);
    console.log("right:", right, "char:", ch);

    if (charMap.has(ch)) {
      let lastSeen = charMap.get(ch);
      console.log("  Duplicate! Last seen at index", lastSeen);
      if (lastSeen >= left) {
        left = lastSeen + 1;
        console.log("  Move left to", left);
      }
    }

    charMap.set(ch, right);
    let windowLen = right - left + 1;
    console.log("  Window [" + left + ".." + right + "], length:", windowLen);

    if (windowLen > maxLen) {
      maxLen = windowLen;
      console.log("  New max length:", maxLen);
    }
    console.log("");
  }

  console.log("Result:", maxLen);
  return maxLen;
}

let result = lengthOfLongestSubstring("abcabcbb");
console.log("Result:", result);
`,
    approach: 'Maintain a variable-size window with a Map storing each character and its most recent index. Expand right one character at a time. When a duplicate is found and its last index is within the current window, jump the left pointer past it. Track the maximum window length throughout.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, m))',
    patternName: 'Sliding Window (Variable Size)',
    whyItWorks: 'The Map lets us instantly detect duplicates and know where to move the left pointer. By jumping left directly past the duplicate instead of shrinking one step at a time, each character is processed at most twice (once by right, once by left), giving linear time.',
  },
  {
    id: 'min-size-subarray-sum',
    name: 'Minimum Size Subarray Sum',
    category: 'sliding-window',
    difficulty: 'medium',
    description: 'Find the minimal length subarray with sum greater than or equal to target',
    code: `// Minimum Size Subarray Sum
// Expand right to grow sum, shrink left when sum >= target

function minSubArrayLen(target, nums) {
  let left = 0;
  let windowSum = 0;
  let minLen = 999999;

  console.log("Target:", target);
  console.log("Array:", nums);
  console.log("");

  for (let right = 0; right < nums.length; right++) {
    windowSum = windowSum + nums[right];
    console.log("Add nums[" + right + "] =", nums[right], "=> sum =", windowSum);

    while (windowSum >= target) {
      let windowLen = right - left + 1;
      console.log("  Sum >= target! Window [" + left + ".." + right + "], length:", windowLen);

      if (windowLen < minLen) {
        minLen = windowLen;
        console.log("  New min length:", minLen);
      }

      console.log("  Shrink: remove nums[" + left + "] =", nums[left]);
      windowSum = windowSum - nums[left];
      left++;
    }
    console.log("");
  }

  let answer = minLen;
  if (minLen === 999999) {
    answer = 0;
  }
  console.log("Result:", answer);
  return answer;
}

let result = minSubArrayLen(7, [2, 3, 1, 2, 4, 3]);
console.log("Result:", result);
`,
    approach: 'Use a variable-size window. Expand right to include more elements and grow the running sum. Whenever the sum meets or exceeds the target, try shrinking from the left to find the smallest valid window, updating the minimum length each time.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Sliding Window (Variable Size)',
    whyItWorks: 'Each element is added once (right pointer) and removed at most once (left pointer), so the total work is O(2n) = O(n). The inner while loop shrinks greedily, ensuring we find the smallest window that satisfies the sum condition.',
  },
  {
    id: 'max-consecutive-ones-iii',
    name: 'Max Consecutive Ones III',
    category: 'sliding-window',
    difficulty: 'medium',
    description: 'Find the longest subarray of 1s after flipping at most k zeros',
    code: `// Max Consecutive Ones III
// Track zero count in window, shrink when zeros > k

function longestOnes(nums, k) {
  let left = 0;
  let zeroCount = 0;
  let maxLen = 0;

  console.log("Array:", nums);
  console.log("Max flips k:", k);
  console.log("");

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) {
      zeroCount++;
      console.log("right:", right, "found 0, zeroCount:", zeroCount);
    } else {
      console.log("right:", right, "found 1");
    }

    while (zeroCount > k) {
      console.log("  Too many zeros! Shrink from left:", left);
      if (nums[left] === 0) {
        zeroCount--;
        console.log("  Removed a zero, zeroCount:", zeroCount);
      }
      left++;
    }

    let windowLen = right - left + 1;
    console.log("  Window [" + left + ".." + right + "], length:", windowLen);

    if (windowLen > maxLen) {
      maxLen = windowLen;
      console.log("  New max length:", maxLen);
    }
    console.log("");
  }

  console.log("Result:", maxLen);
  return maxLen;
}

let result = longestOnes([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2);
console.log("Result:", result);
`,
    approach: 'Maintain a window where the number of zeros does not exceed k. Expand right and count zeros. When zero count exceeds k, shrink from the left until the count is valid again. The window length at each step represents a valid sequence of 1s with at most k flips.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Sliding Window (Variable Size)',
    whyItWorks: 'The window invariant guarantees at most k zeros inside, meaning all zeros in the window can be flipped to 1s. By tracking zero count instead of actually flipping, we efficiently find the longest valid subarray in a single pass.',
  },
  {
    id: 'longest-repeating-char-replacement',
    name: 'Longest Repeating Character Replacement',
    category: 'sliding-window',
    difficulty: 'medium',
    description: 'Find the longest substring where you can replace at most k characters to make all same',
    code: `// Longest Repeating Character Replacement
// Window is valid if (window size - max frequency) <= k

function characterReplacement(s, k) {
  let charFreq = new Map();
  let left = 0;
  let maxFreq = 0;
  let maxLen = 0;

  console.log("String:", s);
  console.log("Max replacements k:", k);
  console.log("");

  for (let right = 0; right < s.length; right++) {
    let ch = s.charAt(right);
    let count = 0;
    if (charFreq.has(ch)) {
      count = charFreq.get(ch);
    }
    count++;
    charFreq.set(ch, count);

    if (count > maxFreq) {
      maxFreq = count;
    }

    console.log("right:", right, "char:", ch, "freq:", count, "maxFreq:", maxFreq);

    let windowSize = right - left + 1;
    let replacements = windowSize - maxFreq;

    if (replacements > k) {
      console.log("  Need", replacements, "replacements > k, shrink from left");
      let leftChar = s.charAt(left);
      let leftCount = charFreq.get(leftChar);
      charFreq.set(leftChar, leftCount - 1);
      left++;
    }

    windowSize = right - left + 1;
    console.log("  Window [" + left + ".." + right + "], size:", windowSize);

    if (windowSize > maxLen) {
      maxLen = windowSize;
      console.log("  New max length:", maxLen);
    }
    console.log("");
  }

  console.log("Result:", maxLen);
  return maxLen;
}

let result = characterReplacement("AABABBA", 1);
console.log("Result:", result);
`,
    approach: 'Track character frequencies in the current window and the maximum frequency of any single character. The window is valid when (window size - max frequency) <= k, meaning the non-majority characters can all be replaced within k operations. When invalid, shrink from the left by one.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Sliding Window (Variable Size)',
    whyItWorks: 'The key insight is that we never need to decrease maxFreq when shrinking. Even if maxFreq is stale, a window can only grow larger if a truly higher frequency is found. This means the window size only increases when we find a better answer, giving us the correct maximum.',
  },
  {
    id: 'permutation-in-string',
    name: 'Permutation in String',
    category: 'sliding-window',
    difficulty: 'medium',
    description: 'Check if one string contains a permutation of another',
    code: `// Permutation in String
// Fixed window of s1.length over s2, compare frequency maps

function mapsEqual(map1, map2) {
  if (map1.size !== map2.size) {
    return false;
  }
  let keys1 = [];
  map1.forEach(function(val, key) {
    keys1.push(key);
  });
  for (let i = 0; i < keys1.length; i++) {
    let key = keys1[i];
    if (!map2.has(key)) {
      return false;
    }
    if (map1.get(key) !== map2.get(key)) {
      return false;
    }
  }
  return true;
}

function checkInclusion(s1, s2) {
  let len1 = s1.length;
  let len2 = s2.length;

  console.log("s1:", s1, "s2:", s2);
  console.log("Window size:", len1);
  console.log("");

  if (len1 > len2) {
    console.log("s1 longer than s2, impossible");
    console.log("Result: false");
    return false;
  }

  // Build frequency map for s1
  let s1Freq = new Map();
  for (let i = 0; i < len1; i++) {
    let ch = s1.charAt(i);
    let count = 0;
    if (s1Freq.has(ch)) {
      count = s1Freq.get(ch);
    }
    s1Freq.set(ch, count + 1);
  }
  console.log("s1 frequency map built");

  // Build frequency map for first window in s2
  let windowFreq = new Map();
  for (let i = 0; i < len1; i++) {
    let ch = s2.charAt(i);
    let count = 0;
    if (windowFreq.has(ch)) {
      count = windowFreq.get(ch);
    }
    windowFreq.set(ch, count + 1);
  }
  console.log("Initial window frequency map built");

  if (mapsEqual(s1Freq, windowFreq)) {
    console.log("Match found at index 0!");
    console.log("Result: true");
    return true;
  }

  // Slide the window
  for (let i = len1; i < len2; i++) {
    let addChar = s2.charAt(i);
    let removeChar = s2.charAt(i - len1);
    console.log("Slide: add '" + addChar + "', remove '" + removeChar + "'");

    // Add new character
    let addCount = 0;
    if (windowFreq.has(addChar)) {
      addCount = windowFreq.get(addChar);
    }
    windowFreq.set(addChar, addCount + 1);

    // Remove old character
    let removeCount = windowFreq.get(removeChar);
    if (removeCount === 1) {
      windowFreq.delete(removeChar);
    } else {
      windowFreq.set(removeChar, removeCount - 1);
    }

    if (mapsEqual(s1Freq, windowFreq)) {
      let startIdx = i - len1 + 1;
      console.log("Match found at index " + startIdx + "!");
      console.log("Result: true");
      return true;
    }
  }

  console.log("No permutation found");
  console.log("Result: false");
  return false;
}

let result = checkInclusion("ab", "eidbaooo");
console.log("Result:", result);
`,
    approach: 'Build a frequency map for s1. Slide a fixed-size window of length s1.length over s2, maintaining a frequency map for the current window. At each position, compare the two frequency maps. If they match, s2 contains a permutation of s1.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Sliding Window (Fixed Size + Frequency)',
    whyItWorks: 'Two strings are permutations of each other if and only if they have identical character frequencies. By maintaining a sliding frequency map, we check every possible substring of the correct length in O(1) amortized time per position.',
  },
  {
    id: 'min-window-substring',
    name: 'Minimum Window Substring',
    category: 'sliding-window',
    difficulty: 'hard',
    description: 'Find the smallest substring that contains all characters of another string',
    code: `// Minimum Window Substring
// Expand right until all chars covered, then shrink left to minimize

function minWindow(s, t) {
  console.log("s:", s);
  console.log("t:", t);
  console.log("");

  if (s.length < t.length) {
    console.log("s shorter than t, impossible");
    console.log("Result: empty string");
    return "";
  }

  // Build frequency map for t
  let tFreq = new Map();
  for (let i = 0; i < t.length; i++) {
    let ch = t.charAt(i);
    let count = 0;
    if (tFreq.has(ch)) {
      count = tFreq.get(ch);
    }
    tFreq.set(ch, count + 1);
  }
  console.log("t has", tFreq.size, "unique characters");

  let windowFreq = new Map();
  let formed = 0;
  let required = tFreq.size;
  let left = 0;
  let minLen = 999999;
  let minLeft = 0;
  let minRight = 0;

  for (let right = 0; right < s.length; right++) {
    let ch = s.charAt(right);
    let count = 0;
    if (windowFreq.has(ch)) {
      count = windowFreq.get(ch);
    }
    windowFreq.set(ch, count + 1);

    // Check if this character's frequency matches t's requirement
    if (tFreq.has(ch) && windowFreq.get(ch) === tFreq.get(ch)) {
      formed++;
      console.log("right:", right, "char:", ch, "- formed:", formed + "/" + required);
    } else {
      console.log("right:", right, "char:", ch);
    }

    // Try to shrink the window
    while (formed === required) {
      let windowLen = right - left + 1;
      console.log("  All chars covered! Window [" + left + ".." + right + "], length:", windowLen);

      if (windowLen < minLen) {
        minLen = windowLen;
        minLeft = left;
        minRight = right;
        console.log("  New min window: length", minLen);
      }

      // Shrink from left
      let leftChar = s.charAt(left);
      let leftCount = windowFreq.get(leftChar);
      windowFreq.set(leftChar, leftCount - 1);

      if (tFreq.has(leftChar) && windowFreq.get(leftChar) < tFreq.get(leftChar)) {
        formed--;
        console.log("  Shrink: removed '" + leftChar + "', lost coverage, formed:", formed + "/" + required);
      } else {
        console.log("  Shrink: removed '" + leftChar + "'");
      }
      left++;
    }
  }

  let answer = "";
  if (minLen !== 999999) {
    answer = s.slice(minLeft, minRight + 1);
  }
  console.log("");
  console.log("Result:", answer);
  return answer;
}

let result = minWindow("ADOBECODEBANC", "ABC");
console.log("Result:", result);
`,
    approach: 'Build a frequency map for t to know what characters are required. Expand the window rightward, tracking how many unique characters have met their required frequency (formed counter). Once all are met, shrink from the left to find the minimum valid window, updating the answer each time.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    patternName: 'Sliding Window (Variable Size + Frequency)',
    whyItWorks: 'The formed counter tracks how many of t\u0027s unique characters are fully satisfied. Expanding right can only increase or maintain formed, while shrinking left can only decrease or maintain it. This monotonic behavior ensures we find the global minimum window efficiently.',
  },
  {
    id: 'sliding-window-maximum',
    name: 'Sliding Window Maximum',
    category: 'sliding-window',
    difficulty: 'hard',
    description: 'Find the maximum in each sliding window of size k',
    code: `// Sliding Window Maximum
// Monotonic deque (as array of indices): front is always the max

function maxSlidingWindow(nums, k) {
  let deque = [];
  let result = [];

  console.log("Array:", nums);
  console.log("Window size k:", k);
  console.log("");

  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside the window from front
    while (deque.length > 0 && deque[0] <= i - k) {
      console.log("Remove front index", deque[0], "(out of window)");
      deque.splice(0, 1);
    }

    // Remove indices of smaller elements from back
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      let removed = deque[deque.length - 1];
      console.log("Remove back index", removed, "(nums[" + removed + "] =", nums[removed], "<= nums[" + i + "] =", nums[i] + ")");
      deque.splice(deque.length - 1, 1);
    }

    deque.push(i);
    console.log("Push index", i, "(value:", nums[i] + "), deque:", deque);

    // Window is fully formed starting at index k-1
    if (i >= k - 1) {
      let maxVal = nums[deque[0]];
      result.push(maxVal);
      console.log("  Window max:", maxVal, "=> result so far:", result);
    }
    console.log("");
  }

  console.log("Result:", result);
  return result;
}

let result = maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3);
console.log("Result:", result);
`,
    approach: 'Use an array as a monotonic deque storing indices in decreasing order of their values. For each new element, remove indices from the back that have smaller values (they can never be the max), and remove indices from the front that are outside the window. The front of the deque is always the index of the current window maximum.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    patternName: 'Sliding Window (Monotonic Deque)',
    whyItWorks: 'Each index is pushed and popped at most once across the entire traversal, giving amortized O(1) per element. The decreasing invariant ensures the front is always the maximum. Removing out-of-window indices from the front keeps only valid candidates.',
  },

  // ==================== ARRAYS & HASHING ====================
  {
    id: 'two-sum',
    name: 'Two Sum',
    category: 'arrays-hashing',
    difficulty: 'easy',
    description: 'Find two numbers that add up to target using hash map',
    code: `// Two Sum - Hash Map Approach
// Store each number's index in a map
// For each number, check if (target - num) exists

function twoSum(nums, target) {
  let map = new Map();

  console.log("Finding two numbers that sum to", target);
  console.log("Array:", nums);
  console.log("");

  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];

    console.log("Index", i + ":", nums[i]);
    console.log("Need complement:", complement);

    if (map.has(complement)) {
      console.log("Found!", complement, "at index", map.get(complement));
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
    console.log("Added to map:", nums[i], "->", i);
    console.log("Map:", Object.fromEntries(map));
    console.log("");
  }

  return [];
}

let nums = [2, 7, 11, 15];
let target = 9;
let result = twoSum(nums, target);
console.log("Result:", result);
`,
    approach: 'Iterate through the array, storing each number and its index in a hash map. For each element, compute the complement (target - current) and check if it exists in the map. If found, return both indices immediately.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Hash Map Lookup',
    whyItWorks: 'The hash map provides O(1) lookup for complements. By building the map as we iterate, we ensure we only find pairs where the complement appears at a different index.',
  },
  {
    id: 'contains-duplicate',
    name: 'Contains Duplicate',
    category: 'arrays-hashing',
    difficulty: 'easy',
    description: 'Check if array contains any duplicate values using Set',
    code: `// Contains Duplicate - Set Approach
// Add each element to a Set
// If element already exists, we found a duplicate

function containsDuplicate(nums) {
  let seen = new Set();

  console.log("Checking for duplicates in:", nums);
  console.log("");

  for (let i = 0; i < nums.length; i++) {
    console.log("Checking:", nums[i]);

    if (seen.has(nums[i])) {
      console.log("Duplicate found!", nums[i]);
      return true;
    }

    seen.add(nums[i]);
    console.log("Added to set. Set size:", seen.size);
    console.log("");
  }

  console.log("No duplicates found");
  return false;
}

console.log("--- Test 1 ---");
containsDuplicate([1, 2, 3, 1]);

console.log("\\n--- Test 2 ---");
containsDuplicate([1, 2, 3, 4]);
`,
    approach: 'Iterate through the array, adding each element to a Set. Before adding, check if the element already exists in the Set. If it does, a duplicate has been found. If the loop completes without finding a duplicate, return false.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Hash Set Lookup',
    whyItWorks: 'A Set provides O(1) average-case insertion and membership testing. If any element is already in the Set when we try to add it, it must have appeared earlier in the array.',
  },
  {
    id: 'valid-anagram',
    name: 'Valid Anagram',
    category: 'arrays-hashing',
    difficulty: 'easy',
    description: 'Check if two strings are anagrams using character frequency',
    code: `// Valid Anagram - Frequency Count
// Count character frequencies in both strings
// Compare the frequency maps

function isAnagram(s, t) {
  if (s.length !== t.length) {
    console.log("Different lengths - not anagram");
    return false;
  }

  console.log("Comparing:", s, "vs", t);
  console.log("");

  let count = new Map();

  // Count characters in first string
  for (let char of s) {
    count.set(char, (count.get(char) || 0) + 1);
  }
  console.log("Frequency of s:", Object.fromEntries(count));

  // Subtract characters from second string
  for (let char of t) {
    if (!count.has(char) || count.get(char) === 0) {
      console.log("Character", char, "not found or exhausted");
      return false;
    }
    count.set(char, count.get(char) - 1);
    console.log("After", char + ":", Object.fromEntries(count));
  }

  console.log("\\nAll characters matched - valid anagram!");
  return true;
}

console.log("--- Test 1 ---");
isAnagram("anagram", "nagaram");

console.log("\\n--- Test 2 ---");
isAnagram("rat", "car");
`,
    approach: 'Count character frequencies of the first string using a hash map. Then subtract frequencies using the second string. If any character count goes below zero or a character is missing, the strings are not anagrams. Equal lengths with matching frequencies confirms an anagram.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Frequency Count',
    whyItWorks: 'Two strings are anagrams if and only if they have identical character frequency distributions. Incrementing for one string and decrementing for the other detects any mismatch.',
  },
  {
    id: 'group-anagrams',
    name: 'Group Anagrams',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Group strings that are anagrams of each other',
    code: `// Group Anagrams
// Sort each string to create a key
// Group strings with the same sorted key

function groupAnagrams(strs) {
  let map = new Map();

  console.log("Grouping anagrams:", strs);
  console.log("");

  for (let str of strs) {
    // Sort string to create key
    let key = str.split('').sort().join('');

    console.log("String:", str, "-> Key:", key);

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);

    console.log("Groups so far:", Object.fromEntries(map));
    console.log("");
  }

  let result = Array.from(map.values());
  console.log("Final groups:", result);
  return result;
}

let strs = ["eat", "tea", "tan", "ate", "nat", "bat"];
groupAnagrams(strs);
`,
    approach: 'For each string, sort its characters to create a canonical key. Use a hash map where the key is the sorted string and the value is a list of original strings sharing that key. Strings that are anagrams of each other produce the same sorted key.',
    timeComplexity: 'O(n * k log k)',
    spaceComplexity: 'O(n * k)',
    patternName: 'Hash Map Grouping',
    whyItWorks: 'Anagrams are permutations of the same characters, so sorting them produces an identical string. This sorted form serves as a unique group identifier in the hash map.',
  },
  {
    id: 'top-k-frequent',
    name: 'Top K Frequent Elements',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Find the k most frequent elements using bucket sort',
    code: `// Top K Frequent Elements - Bucket Sort
// Count frequencies, then use bucket sort
// Bucket index = frequency, value = elements

function topKFrequent(nums, k) {
  console.log("Finding top", k, "frequent in:", nums);
  console.log("");

  // Step 1: Count frequencies
  let freq = new Map();
  for (let num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  console.log("Frequencies:", Object.fromEntries(freq));

  // Step 2: Create buckets (index = frequency)
  let buckets = new Array(nums.length + 1).fill(null).map(() => []);

  for (let [num, count] of freq) {
    buckets[count].push(num);
    console.log("Bucket", count + ":", buckets[count]);
  }

  // Step 3: Collect top k from highest buckets
  let result = [];
  console.log("\\nCollecting top", k, "from buckets:");

  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    if (buckets[i].length > 0) {
      console.log("Bucket", i + ":", buckets[i]);
      result.push(...buckets[i]);
    }
  }

  result = result.slice(0, k);
  console.log("\\nResult:", result);
  return result;
}

let nums = [1, 1, 1, 2, 2, 3];
topKFrequent(nums, 2);
`,
    approach: 'First count element frequencies using a hash map. Then use bucket sort where the bucket index represents frequency and the bucket contents are elements with that frequency. Collect elements from the highest-frequency buckets until k elements are gathered.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Frequency Count + Bucket Sort',
    whyItWorks: 'Bucket sort avoids the O(n log n) cost of comparison-based sorting. Since frequencies are bounded by array length, creating buckets indexed by frequency enables linear-time extraction of the top k elements.',
  },
  {
    id: 'product-except-self',
    name: 'Product of Array Except Self',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Calculate product of all elements except self without division',
    code: `// Product of Array Except Self
// Use prefix and suffix products
// result[i] = prefix[i] * suffix[i]

function productExceptSelf(nums) {
  let n = nums.length;
  let result = new Array(n).fill(1);

  console.log("Input:", nums);
  console.log("");

  // Calculate prefix products
  console.log("--- Prefix Products ---");
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    console.log("result[" + i + "] = prefix", prefix);
    prefix *= nums[i];
    console.log("prefix *= nums[" + i + "] =", prefix);
  }
  console.log("After prefix:", result);

  // Calculate suffix products and multiply
  console.log("\\n--- Suffix Products ---");
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    console.log("result[" + i + "] *= suffix", suffix, "=", result[i]);
    suffix *= nums[i];
    console.log("suffix *= nums[" + i + "] =", suffix);
  }

  console.log("\\nFinal result:", result);
  return result;
}

let nums = [1, 2, 3, 4];
productExceptSelf(nums);
`,
    approach: 'Build the result in two passes without using division. First pass computes prefix products: result[i] holds the product of all elements before index i. Second pass multiplies in suffix products from right to left. Each result[i] becomes prefix[i] * suffix[i].',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Prefix Product',
    whyItWorks: 'The product of all elements except self at index i is the product of everything to its left times everything to its right. Two passes accumulate these partial products without needing division.',
  },
  {
    id: 'longest-consecutive',
    name: 'Longest Consecutive Sequence',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Find length of longest consecutive sequence in O(n)',
    code: `// Longest Consecutive Sequence
// Use Set for O(1) lookup
// Only start counting from sequence beginnings

function longestConsecutive(nums) {
  if (nums.length === 0) return 0;

  let numSet = new Set(nums);
  let longest = 0;

  console.log("Array:", nums);
  console.log("Set:", [...numSet]);
  console.log("");

  for (let num of numSet) {
    // Only start if num-1 doesn't exist (sequence start)
    if (!numSet.has(num - 1)) {
      console.log("Starting sequence at:", num);

      let currentNum = num;
      let currentStreak = 1;

      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;
        console.log("  Found:", currentNum, "streak:", currentStreak);
      }

      longest = Math.max(longest, currentStreak);
      console.log("  Sequence length:", currentStreak);
      console.log("  Longest so far:", longest);
      console.log("");
    }
  }

  console.log("Longest consecutive:", longest);
  return longest;
}

let nums = [100, 4, 200, 1, 3, 2];
longestConsecutive(nums);
`,
    approach: 'Insert all numbers into a Set for O(1) lookup. For each number, check if it is the start of a sequence (num - 1 not in Set). If so, count consecutive numbers upward. Track the longest sequence found across all starting points.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    patternName: 'Hash Set Lookup',
    whyItWorks: 'Only starting sequence exploration from true sequence starts (where num - 1 is absent) ensures each element is visited at most twice total, achieving O(n) despite the nested while loop.',
  },
  {
    id: 'best-time-buy-sell',
    name: 'Best Time to Buy and Sell Stock',
    category: 'arrays-hashing',
    difficulty: 'easy',
    description: 'Find maximum profit from one buy and one sell',
    code: `// Best Time to Buy and Sell Stock
// Track minimum price seen so far
// Calculate profit at each step

function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  console.log("Prices:", prices);
  console.log("");

  for (let i = 0; i < prices.length; i++) {
    let price = prices[i];
    console.log("Day", i + ":", "price =", price);

    if (price < minPrice) {
      minPrice = price;
      console.log("  New minimum price:", minPrice);
    }

    let profit = price - minPrice;
    console.log("  Profit if sell today:", profit);

    if (profit > maxProfit) {
      maxProfit = profit;
      console.log("  New max profit!", maxProfit);
    }
    console.log("");
  }

  console.log("Maximum profit:", maxProfit);
  return maxProfit;
}

let prices = [7, 1, 5, 3, 6, 4];
maxProfit(prices);
`,
    approach: 'Scan prices left to right, tracking the minimum price seen so far. At each day, calculate the profit if selling at the current price. Update the maximum profit whenever a better profit is found. The minimum price resets whenever a new low is encountered.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Running Minimum',
    whyItWorks: 'The optimal buy day is always the lowest price before the sell day. By tracking the running minimum, each potential sell day is compared against the best possible buy price.',
  },
  {
    id: 'maximum-subarray',
    name: 'Maximum Subarray (Kadane)',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Find contiguous subarray with largest sum using Kadane algorithm',
    code: `// Maximum Subarray - Kadane's Algorithm
// At each position: extend current subarray or start new
// currentSum = max(nums[i], currentSum + nums[i])

function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];

  console.log("Array:", nums);
  console.log("Starting with:", nums[0]);
  console.log("");

  for (let i = 1; i < nums.length; i++) {
    console.log("Index", i + ":", nums[i]);
    console.log("  Current sum before:", currentSum);

    // Decide: start fresh or extend?
    if (currentSum + nums[i] > nums[i]) {
      currentSum = currentSum + nums[i];
      console.log("  Extend subarray:", currentSum);
    } else {
      currentSum = nums[i];
      console.log("  Start new subarray:", currentSum);
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      console.log("  New max sum!", maxSum);
    }
    console.log("");
  }

  console.log("Maximum subarray sum:", maxSum);
  return maxSum;
}

let nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
maxSubArray(nums);
`,
    approach: 'Use Kadane\'s algorithm: at each position, decide whether to extend the current subarray or start a new one. If the running sum plus the current element exceeds the element alone, extend. Otherwise, start fresh. Track the global maximum sum throughout.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Kadane\'s Algorithm',
    whyItWorks: 'A negative running sum can only hurt future sums. Resetting when currentSum + nums[i] < nums[i] ensures we never carry forward a net-negative prefix, and the global max captures the best subarray seen.',
  },
  {
    id: 'majority-element',
    name: 'Majority Element',
    category: 'arrays-hashing',
    difficulty: 'easy',
    description: 'Find element appearing more than n/2 times using Boyer-Moore',
    code: `// Majority Element - Boyer-Moore Voting
// Maintain a candidate and count
// If count = 0, pick new candidate

function majorityElement(nums) {
  let candidate = null;
  let count = 0;

  console.log("Array:", nums);
  console.log("Looking for element appearing >", nums.length / 2, "times");
  console.log("");

  for (let i = 0; i < nums.length; i++) {
    let num = nums[i];
    console.log("Index", i + ":", num);

    if (count === 0) {
      candidate = num;
      console.log("  New candidate:", candidate);
    }

    if (num === candidate) {
      count++;
      console.log("  Match! Count:", count);
    } else {
      count--;
      console.log("  Different. Count:", count);
    }
    console.log("");
  }

  console.log("Majority element:", candidate);
  return candidate;
}

let nums = [2, 2, 1, 1, 1, 2, 2];
majorityElement(nums);
`,
    approach: 'Use Boyer-Moore Voting: maintain a candidate and a count. When count drops to zero, adopt the current element as the new candidate. Increment count for matches, decrement for mismatches. The majority element always survives as the final candidate.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patternName: 'Boyer-Moore Voting',
    whyItWorks: 'The majority element appears more than n/2 times. Every time it is "cancelled" by a different element, at most one copy is lost. Since it has more copies than all others combined, it always remains as the last candidate standing.',
  },
]
