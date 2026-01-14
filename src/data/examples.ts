export interface CodeExample {
  id: string
  name: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  code: string
}

// Main 9 categories for the home page
export const exampleCategories = [
  { id: 'js-core', name: 'JavaScript Core', icon: '⚡', description: 'Closures, this, prototypes, hoisting, scope' },
  { id: 'async-js', name: 'Async JavaScript', icon: '⏳', description: 'Promises, async/await, event loop patterns' },
  { id: 'array-polyfills', name: 'Array Polyfills', icon: '🔧', description: 'Implement map, filter, reduce, flat' },
  { id: 'utility-functions', name: 'Utility Functions', icon: '🛠️', description: 'Debounce, throttle, deep clone, memoize' },
  { id: 'functional-js', name: 'Functional JS', icon: 'λ', description: 'Curry, compose, pipe, partial application' },
  { id: 'dom-events', name: 'DOM & Events', icon: '🎯', description: 'Event emitter, delegation, pub/sub' },
  { id: 'object-utils', name: 'Object Utilities', icon: '📦', description: 'Deep equal, merge, get/set nested props' },
  { id: 'promise-polyfills', name: 'Promise Polyfills', icon: '🤝', description: 'Promise.all, race, allSettled, promisify' },
  { id: 'dsa', name: 'DSA', icon: '🧠', description: 'Data structures & algorithms (30 problems)' },
]

// DSA subcategories for filtering within DSA page
export const dsaSubcategories = [
  { id: 'arrays-hashing', name: 'Arrays & Hashing', icon: '📊' },
  { id: 'two-pointers', name: 'Two Pointers', icon: '👆' },
  { id: 'sliding-window', name: 'Sliding Window', icon: '🪟' },
  { id: 'stack', name: 'Stack', icon: '📚' },
  { id: 'binary-search', name: 'Binary Search', icon: '🔍' },
  { id: 'linked-list', name: 'Linked List', icon: '🔗' },
  { id: 'strings', name: 'Strings', icon: '📝' },
  { id: 'sorting', name: 'Sorting', icon: '📈' },
  { id: 'recursion', name: 'Recursion', icon: '🔄' },
  { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '🧮' },
  { id: 'greedy', name: 'Greedy', icon: '💰' },
  { id: 'backtracking', name: 'Backtracking', icon: '↩️' },
  { id: 'graphs', name: 'Graphs', icon: '🕸️' },
  { id: 'trees', name: 'Trees', icon: '🌳' },
  { id: 'trie', name: 'Trie', icon: '🌲' },
  { id: 'heap', name: 'Heap', icon: '⛰️' },
  { id: 'intervals', name: 'Intervals', icon: '📏' },
  { id: 'bit-manipulation', name: 'Bit Manipulation', icon: '🔢' },
  { id: 'math', name: 'Math & Geometry', icon: '➗' },
]

// Helper to check if a category is a DSA subcategory
export const isDsaSubcategory = (cat: string) => dsaSubcategories.some(s => s.id === cat)

// Get examples by main category (maps DSA subcategories to 'dsa')
export const getExamplesByCategory = (categoryId: string) => {
  if (categoryId === 'dsa') {
    return codeExamples.filter(e => isDsaSubcategory(e.category))
  }
  return codeExamples.filter(e => e.category === categoryId)
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
  },

  // ==================== TWO POINTERS ====================
  {
    id: 'two-sum-ii',
    name: 'Two Sum II (Sorted)',
    category: 'two-pointers',
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
  },
  {
    id: 'container-with-most-water',
    name: 'Container With Most Water',
    category: 'two-pointers',
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
  },
  {
    id: 'three-sum',
    name: '3Sum',
    category: 'two-pointers',
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
  },
  {
    id: 'trapping-rain-water',
    name: 'Trapping Rain Water',
    category: 'two-pointers',
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
  },
]
